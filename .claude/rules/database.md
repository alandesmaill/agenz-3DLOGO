---
paths:
  - lib/**/*.ts
  - prisma/**
  - app/api/**
---

# Data Rules — Agenz Website

## Database (Vercel Postgres + Prisma)

Camera rental and portfolio/works content is stored in **Vercel Postgres** via **Prisma ORM**. Admin dashboard at `/admin` manages this content.

- Prisma schema: `prisma/schema.prisma`
- DB singleton: `lib/db/prisma.ts`
- DB query layer: `lib/db/camera-rental.ts`, `lib/db/works.ts`
- Admin API routes: `app/api/admin/`
- Public read-only API: `app/api/content/`

## Static Data Files (still used)

| File | Purpose |
|------|---------|
| `lib/about-content.ts` | About page copy, stats, and section data |
| `lib/services-data.ts` | Service cards list |
| `lib/camera-rental-data.ts` | TypeScript interfaces only (data now in DB) |
| `lib/works-data.ts` | TypeScript interfaces only (data now in DB) |

## Type Rules

- No `any` types — all data must be fully typed
- The `pricing` field was **removed** from the `Service` interface — **do NOT add it back**

## Admin Dashboard

- Auth: NextAuth.js v5 with credentials provider
- Routes: `/admin/*` protected by `middleware.ts`
- Image uploads: Vercel Blob via `/api/admin/upload`
