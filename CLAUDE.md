# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run lint             # Run ESLint
npm run test:perf:headed # Run Playwright performance tests (accurate GPU rendering)
npm run test:perf        # Run headless (faster but lower FPS due to software rendering)
npm run test:perf:report # View HTML report from last run
npm run analyze          # Bundle analysis (sets ANALYZE=true)

# Run specific test suites
npx playwright test tests/performance.spec.ts             # 3D scene
npx playwright test tests/text-animation.spec.ts          # Text animations
npx playwright test tests/navigation-flow.spec.ts         # Full nav flow
npx playwright test tests/contact-form.spec.ts            # Contact form
npx playwright test tests/services-performance.spec.ts    # Services
npx playwright test tests/service-detail-performance.spec.ts  # Service detail pages
```

## Architecture Overview

**Three.js + Next.js 15 + React Three Fiber + GSAP** — interactive 3D fractured logo as the main navigation system. The user clicks a 3D logo that explodes into pieces; the 4 largest pieces become navigation items (About, Works, Services, Contact).

### Strict Component Separation

- **`/components/canvas/`** — Three.js/WebGL components (`'use client'`, never SSR)
- **`/components/dom/`** — Regular React/DOM components (HTML overlays, pages, UI)
- **`/app/`** — Next.js App Router pages
- **`/lib/`** — Data files and utilities (content, services data, works data)

### Critical Rendering Hierarchy

```
<Canvas>  →  <Scene>  →  <FracturedLogo /> (and other 3D objects)
```

3D meshes MUST be inside `<Canvas>` → `<Scene>`. All 3D components use dynamic import with `ssr: false`.

### Navigation Flow

Two paths exist to reach sections:
1. **3D navigation**: Landing page → click logo piece → `TestSection` renders section in-place (canvas unmounts for performance)
2. **Direct routes**: `/about`, `/works`, `/contact`, `/services/*`

**Important**: When clicking a 3D piece, `View.tsx` must hide its light Header so the section's dark Header doesn't conflict (fixed in `!testSection.isVisible` check).

### Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with 3D fractured logo |
| `/about` | About section (hero + mission + CTA) |
| `/works` | Portfolio showcase with morph animations |
| `/works/[id]` | Individual project detail pages |
| `/contact` | Contact form (EmailJS + reCAPTCHA) |
| `/services` | Services overview (bento grid) |
| `/services/advertising` | Service detail page |
| `/services/video` | Service detail page |
| `/services/design` | Service detail page |
| `/services/strategy` | Service detail page |

### Key Architectural Patterns

**Animation System** — Three approaches, never mix them on the same property:
1. **GSAP timelines** for triggered sequences (decompose, camera zoom) — tracked in refs, killed on unmount
2. **GSAP single tweens** for interactive effects (hover glow, scale)
3. **`useFrame`** for continuous per-frame animation (idle rotation, floating) — uses `delta` for frame-rate independence

**Smooth Scroll + ScrollTrigger** — Lenis wraps scrollable sections. Multiple `ScrollTrigger.refresh()` calls at staggered intervals (500ms, 600ms, 800ms, 1000ms) fix a race condition where triggers scan before content settles. **Do NOT reduce these timers.**

**FracturedLogo Auto-Detection** — Loads GLB model, calculates bounding box volume for each mesh, picks top 4 by volume as navigation pieces, rest become debris. Navigation pieces map to sections by size order.

**Canvas Unmounting** — When a section displays after 3D navigation, the canvas unmounts after 800ms to free GPU resources. Back button reloads the page entirely.

## Key Conventions

### Brand Colors

- Green: `#00e92c`
- Cyan: `#00ffff`
- Gradient: `from-[#00e92c] to-[#00ffff]`
- Dark background: `#050505`

### Styling

- **Tailwind CSS** for all DOM components
- **CSS variables** in `globals.css` for theming
- **Glassmorphism pattern**: `backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl`
- Custom font: Gibson (loaded via `@font-face` in globals.css)
- Path alias: `@/*` maps to project root

### Header Variants

`Header` component accepts `variant="light"` (default, for landing page) or `variant="dark"` (for dark-bg sections like About, Contact). Each section renders its own Header.

### About Page Structure

Three full-screen sections with `SmoothScrolling` wrapper:
1. **Hero** — Large white text (WELCOME TO / AGENZ / tagline), flower shape image on right, dark gradient background
2. **Mission** — Glass card with mission statement + 4 animated stats (count-up on scroll)
3. **CTA** — Centered headline + "Get in Touch" button, graphics shape on left

Content data lives in `/lib/about-content.ts`. Background uses 6-layer radial gradients plus per-section overlay gradients.

### Contact Form

Simplified liquid glass design. EmailJS for sending (dual template: notify owner + confirm to user), reCAPTCHA v3 for spam, Zod validation. See Environment Variables section for setup.

### Service Detail Pages

All follow the same pattern: Hero → Overview → Feature Grid → Case Study Carousel → FAQ Accordion → CTA. Content in `/lib/service-details-data.ts`.

## Critical Rules

### No Pricing Policy

**Pricing information is strictly forbidden on the website.** The `pricing` field was removed from the Service interface. Do not add it back. If asked, suggest "Contact for Quote" or "Schedule Consultation" alternatives. FAQ mentions of client budgets (educational context) are acceptable.

### next.config.js — Do Not Remove

Webpack config handles GLB/GLTF assets and externalizes Three.js on server. Turbopack config mirrors this for dev mode.

### ScrollTrigger Refresh Timers

The staggered `setTimeout` calls in `SmoothScrolling`, section components, and `AnimatedText` fix a real race condition. Do not remove or reduce them.

### forwardRef Pattern

`ServiceCard` uses `forwardRef` with a **named function** (not arrow function) for SWC compatibility.

## Environment Variables

```bash
# EmailJS (contact form)
EMAILJS_SERVICE_ID=...
EMAILJS_TEMPLATE_ID=...          # Notification to owner
EMAILJS_USER_TEMPLATE_ID=...     # Confirmation to user
EMAILJS_PUBLIC_KEY=...
EMAILJS_PRIVATE_KEY=...

# Google reCAPTCHA v3 (spam prevention)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...
```

Form works without these (client-side validation still runs, API calls fail gracefully).

## Performance Testing

Tests target 60fps (55fps minimum, 50fps critical). Thresholds in `tests/helpers/constants.ts`. Use `--headed` for accurate WebGL measurements — headless mode uses software rendering and reports lower FPS.

## Debugging Quick Reference

**3D pieces not detected**: GLB needs 4+ distinct meshes, check bounding box volume calculation
**Animations not triggering after navigation**: Verify ScrollTrigger refresh timers are intact
**Light header flashing over dark section**: Check `View.tsx` hides Header when `testSection.isVisible`
**Model 404**: Path in code is `/models/...` (no `/public` prefix), verify webpack GLB config
**Smooth scroll janky**: Check Lenis `lerp` value, verify no conflicting RAF loops
