import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
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

const phoneRegex = /^[+]?(?=.*\d)[\d\s\-()]{7,20}$/;

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().trim().refine((val) => val === '' || phoneRegex.test(val)).optional(),
  company: z.string().max(100).optional(),
  services: z.array(z.string()).optional(),
  message: z.string().min(10).max(1000),
});

function fillTemplate(templatePath: string, vars: Record<string, string>): string {
  let html = fs.readFileSync(path.join(process.cwd(), templatePath), 'utf-8');
  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }
  return html;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const data = contactSchema.parse(body);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromDomain = process.env.RESEND_FROM_DOMAIN || 'agenz-iq.com';
    const ownerEmail = process.env.ADMIN_EMAIL || 'agenz@agenz-iq.com';

    const notificationHtml = fillTemplate('emails/notification.html', {
      from_name: data.name,
      from_email: data.email,
      phone: data.phone || 'Not provided',
      company: data.company || 'Not provided',
      services: data.services && data.services.length > 0 ? data.services.join(', ') : 'Not specified',
      message: data.message,
    });

    await resend.emails.send({
      from: `Agenz Contact <noreply@${fromDomain}>`,
      to: ownerEmail,
      replyTo: data.email,
      subject: `New inquiry from ${data.name}${data.company ? ` · ${data.company}` : ''}`,
      html: notificationHtml,
    });

    const autoreplyHtml = fillTemplate('emails/autoreply.html', {
      from_name: data.name,
      from_email: data.email,
      to_email: data.email,
    });

    await resend.emails.send({
      from: `Agenz <noreply@${fromDomain}>`,
      to: data.email,
      subject: `We received your message, ${data.name}`,
      html: autoreplyHtml,
    }).catch(() => {
      // Auto-reply failure doesn't block success
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      return NextResponse.json({ error: 'Validation failed', details: fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
