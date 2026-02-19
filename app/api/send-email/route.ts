import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// --- In-memory rate limiter (5 requests per hour per IP) ---
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Clean up stale entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 10 * 60 * 1000);

// --- Fetch with timeout helper ---
const FETCH_TIMEOUT_MS = 10_000;

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// --- Validation Schema ---
const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .refine((val) => val === '' || phoneRegex.test(val), {
      message: 'Invalid phone number format',
    })
    .optional(),
  company: z.string().max(100, 'Company name is too long').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
  captchaToken: z.string().min(1, 'Captcha verification required'),
});

/**
 * Verify reCAPTCHA token with Google's API
 */
async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    // Check if secret key is configured
    if (!secretKey || secretKey.includes('your_')) {
      console.error('[API] reCAPTCHA secret key not configured');
      return false;
    }

    const response = await fetchWithTimeout('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success && data.score > 0.7;
  } catch (error) {
    console.error('[API] reCAPTCHA verification error:', error);
    return false;
  }
}

/**
 * Send email via EmailJS REST API
 */
async function sendEmailJS(templateId: string, params: Record<string, string>) {
  const response = await fetchWithTimeout('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: params,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS API failed: ${response.status}`);
  }

  return response.json();
}

/**
 * POST handler for contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate input
    const validated = contactSchema.parse(body);

    // Verify reCAPTCHA
    const captchaValid = await verifyCaptcha(validated.captchaToken);
    if (!captchaValid) {
      return NextResponse.json(
        { error: 'Captcha verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Prepare email parameters
    const timestamp = new Date().toISOString();

    const emailParams = {
      from_name: validated.name,
      from_email: validated.email,
      phone: validated.phone || 'Not provided',
      company: validated.company || 'Not provided',
      message: validated.message,
      timestamp,
      ip_address: ip,
    };

    // Send main notification email to site owner
    await sendEmailJS(
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      emailParams
    );

    // Send auto-reply to user
    await sendEmailJS(
      process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID!,
      {
        from_name: validated.name,
        from_email: validated.email,
        to_email: validated.email,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {

    // Handle validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((err: z.ZodIssue) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });

      return NextResponse.json(
        {
          error: 'Validation failed',
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
