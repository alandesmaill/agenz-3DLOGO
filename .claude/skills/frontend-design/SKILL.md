---
name: frontend-design
description: Apply Agenz brand design standards — glassmorphism, gradient text, dark depth — to any UI component
user-invocable: true
---

You are implementing UI for the Agenz Website. Apply these design standards to every component.

## Brand Identity

- **Green**: `#00e92c`
- **Cyan**: `#00ffff`
- **Dark background**: `#050505` (not pure black)
- **Font**: Gibson — loaded via `@font-face` in `globals.css`; use font-family Gibson or the CSS variable

## Typography

- **Gradient text** (headlines, brand name):
  `bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent`
- **Primary body text**: `text-white`
- **Secondary / supporting text**: `text-white/80` or `text-white/60`
- **Scale**: Large display text for hero sections (`text-6xl` to `text-8xl`), `text-xl`/`text-2xl` for body

## Surface Patterns

- **Glassmorphism** (cards, modals, panels):
  `backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl`
- **Glow accent**: `shadow-[0_0_30px_rgba(0,233,44,0.15)]` for green glow; swap `0,255,255` for cyan glow
- **Depth layering**: Use multiple radial gradients in CSS for background depth — avoid flat solid backgrounds

## Spacing

- **Section padding**: `py-20 md:py-32`
- **Card padding**: `p-6 md:p-8`
- **Max content width**: `max-w-7xl mx-auto px-4`

## Motion

- **Entrance**: GSAP fade-up — `y: 40` to `y: 0`, `opacity: 0` to `opacity: 1`, duration `0.6`–`0.8s`, ease `power2.out`
- **Stagger**: `0.1`–`0.15s` between sequential items
- **Hover scale**: `1.02`–`1.05` with GSAP tween, duration `0.3s`
- **Scroll-triggered**: Use ScrollTrigger with `start: "top 80%"` for most entrance animations

## Dark Mode Rules

- This is a **dark-only site** — never add light mode styles
- Use `#050505` as the base background — not `#000000`
- Text on dark: always `text-white` or `text-white/{opacity}`

## Reusable Patterns

### Glassmorphism card
```tsx
<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
```

### Gradient button
```tsx
<button className="bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
```

### Section wrapper
```tsx
<section className="py-20 md:py-32">
  <div className="max-w-7xl mx-auto px-4">
```

### Header variants
```tsx
<Header variant="light" />  {/* landing page — light colored nav */}
<Header variant="dark" />   {/* section pages — dark bg nav */}
```
