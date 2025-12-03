import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().max(100, 'Company name is too long').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
  captchaToken: z.string().min(1, 'Captcha verification required'),
});

/**
 * Verify reCAPTCHA token with Google's API
 */
async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    return data.success && data.score > 0.5; // reCAPTCHA v3 score threshold
  } catch (error) {
    return false;
  }
}

/**
 * Send email via EmailJS REST API
 */
async function sendEmailJS(templateId: string, params: any) {
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
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
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown';

    const emailParams = {
      from_name: validated.name,
      from_email: validated.email,
      phone: validated.phone || 'Not provided',
      company: validated.company || 'Not provided',
      message: validated.message,
      timestamp,
      ip_address: ipAddress,
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
        to_email: validated.email, // Ensure auto-reply goes to user
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
