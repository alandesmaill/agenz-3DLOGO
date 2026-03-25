---
paths:
  - components/**/*.tsx
  - app/**/*.tsx
  - app/**/*.ts
---

# Frontend Rules — Agenz Website

## Component Architecture

- **Canvas components** live in `/components/canvas/` — must have `'use client'` at the top, never used in SSR context
- **DOM components** live in `/components/dom/` — plain React, no Three.js or React Three Fiber imports
- **No mixing** — canvas and DOM concerns must not be combined in a single file
- **3D components** must be loaded with `dynamic import` and `ssr: false`

## Styling

- **Tailwind CSS only** — no inline styles, no CSS modules for DOM components
- **Brand colors**: green `#00e92c`, cyan `#00ffff`, dark background `#050505`
- **Glassmorphism pattern**: `backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl`
- **Gradient text**: `bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent`
- **Font**: Gibson (loaded via `@font-face` in `globals.css`) — do not import external fonts

## Animation

- **GSAP timelines** — for triggered sequences (entrance, decompose, camera zoom); store in refs, kill on unmount
- **GSAP single tweens** — for interactive effects (hover glow, scale)
- **`useFrame`** — for continuous per-frame animation (idle rotation, floating); always use `delta` parameter for frame-rate independence
- **Never mix** two animation approaches on the same property

## Scroll

- Scrollable sections must be wrapped in `SmoothScrolling` (Lenis wrapper)
- `ScrollTrigger` refresh calls at 500ms, 600ms, 800ms, and 1000ms **must not be removed** — they fix a race condition where triggers fire before content settles

## Components

- Functional components with hooks only — no class components
- `forwardRef` must use **named functions**, not arrow functions (SWC compatibility requirement)
- `Header` component accepts `variant="light"` (landing page) or `variant="dark"` (section pages)
- Use `next/image` for all images — no raw `<img>` tags

## Forbidden

- No pricing information anywhere — not in components, data files, or copy
- No `any` types in TypeScript
- No prop drilling more than 2 levels deep — use composition or context
