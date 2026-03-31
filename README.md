# Agenz — Creative Agency Website

Full-featured creative agency website with an interactive 3D fractured logo navigation, CMS admin dashboard, camera rental service, and portfolio showcase.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Three.js](https://img.shields.io/badge/Three.js-v0.169.0-black?style=flat-square&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38BDF8?style=flat-square&logo=tailwindcss)

## Features

### Interactive 3D Navigation
- Fractured logo decomposes into 4 floating navigation pieces (About, Works, Services, Contact)
- Smart piece detection — auto-identifies the 4 largest mesh volumes as nav elements
- Cinematic camera zoom, particle assembly animation, bloom post-processing
- Liquid glass navigation labels with glassmorphism UI

### Pages & Sections
- **Landing** — 3D fractured logo hero
- **About** — Mission, stats, team CTA
- **Works** — Portfolio showcase with morph animations, DB-driven
- **Services** — Bento grid overview
- **Camera Rental** — Full equipment catalogue with packages, DB-driven
- **Contact** — EmailJS contact form with reCAPTCHA v3
- **Privacy & Terms** — Legal pages

### CMS Admin Dashboard (`/admin`)
- Protected by NextAuth.js credentials authentication
- CRUD for portfolio projects, camera rental packages, equipment, client logos
- Image uploads via Vercel Blob + Supabase Storage
- Full content management without touching code

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| 3D | Three.js + React Three Fiber + Drei |
| Animation | GSAP + Lenis smooth scroll |
| Styling | Tailwind CSS + Glassmorphism |
| Database | Supabase (Postgres) via Prisma ORM |
| Auth | NextAuth.js v5 (credentials) |
| Storage | Vercel Blob + Supabase Storage |
| Email | EmailJS |
| Deployment | Vercel |

## Quick Start

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
```

## Environment Variables

Copy `.env.example` and fill in your values:

```bash
# Database
DATABASE_URL=
POSTGRES_PRISMA_URL=

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
ADMIN_EMAIL=
ADMIN_INITIAL_PASSWORD=

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=

# reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# Vercel
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_SITE_URL=
```

## Database Setup

```bash
npx prisma db push    # Push schema to Supabase
npx prisma db seed    # Seed admin user + initial data
```

## Project Structure

```
├── app/
│   ├── (admin)/admin/    # CMS admin dashboard
│   ├── api/              # API routes (auth, admin, content)
│   ├── works/            # Portfolio pages
│   ├── services/         # Service pages
│   └── page.tsx          # Landing page
├── components/
│   ├── canvas/           # Three.js/WebGL components
│   └── dom/              # React/DOM UI components
├── lib/
│   ├── db/               # Prisma query layer
│   └── *.ts              # Content data & utilities
└── prisma/
    ├── schema.prisma     # Database schema
    └── seed.ts           # Initial data seed
```

## Brand

- Green: `#00e92c` — Cyan: `#00ffff`
- Dark background: `#050505`
- Font: Gibson
- Glassmorphism: `backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl`
