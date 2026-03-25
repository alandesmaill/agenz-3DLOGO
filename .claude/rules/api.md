---
paths:
  - app/api/**/*.ts
  - lib/**/*.ts
---

# API Rules — Agenz Website

## Route Handlers

- All user input must be validated with **Zod** in the route handler — not just on the client
- Return appropriate HTTP status codes: 200 OK, 400 Bad Request, 422 Unprocessable Entity, 500 Internal Server Error
- Never expose internal error details (stack traces, database errors) to the client response
- Use `NextResponse.json()` for all responses

## Environment Variables

### Server-only (must NEVER have `NEXT_PUBLIC_` prefix)
- `EMAILJS_PRIVATE_KEY` — used server-side only to authenticate EmailJS requests
- `RECAPTCHA_SECRET_KEY` — used server-side to verify reCAPTCHA tokens

### Client-safe
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` — safe to expose; used by reCAPTCHA widget in browser
- `EMAILJS_PUBLIC_KEY` — safe to expose; authenticates EmailJS client-side SDK

## Contact Form (`app/api/contact/route.ts`)

- Verify reCAPTCHA v3 token **server-side** before processing the form — reject if score is below threshold
- Send two EmailJS emails: notification to owner (`EMAILJS_TEMPLATE_ID`) and confirmation to user (`EMAILJS_USER_TEMPLATE_ID`)
- HTML email templates live in `/emails/notification.html` and `/emails/autoreply.html`

## Security

- When integrating a new external service, update the Content-Security-Policy in `next.config.js`:
  - API endpoints → `connect-src`
  - Script tags → `script-src`
  - Image sources → `img-src`
- Requests to unlisted origins will be blocked in production

## Data Files

- Static content lives in `/lib/` as TypeScript exports — there is no database
- Do not add API routes that fetch from a database or external CMS
- Keep data as close to the component that uses it as possible
