# Visual Refinement Design — Approach B
Date: 2026-02-23

## Problem
The website is too dark — not because the dark theme is wrong, but because:
1. Background radial gradient halos are nearly invisible (0.06–0.10 opacity)
2. Body text at white/40 and white/30 opacity is barely readable
3. Card surfaces (bg-white/5, border-white/8) blend into the void
4. Client logos default to full grayscale making them look dead

## Solution
Refined visibility boost — keep the dark premium aesthetic, fix readability and depth.

## Changes

### globals.css
- `--border`: `rgba(255,255,255,0.08)` → `rgba(255,255,255,0.14)`
- `--text-muted`: `rgba(255,255,255,0.40)` → `rgba(255,255,255,0.60)`

### Background halos (AboutSection, ServicesSection, ContactSection, works/page.tsx)
- Corner halos: 0.10 → 0.20, 0.08 → 0.18, 0.07 → 0.16
- Inner section glows: 0.06 → 0.14, 0.05 → 0.12

### Card surfaces (all components)
- `bg-white/5` → `bg-white/8`
- `border-white/8` → `border-white/14`

### Text opacity
- `text-white/40` → `text-white/60` (body/description)
- `text-white/30` → `text-white/50` (meta/secondary)

### ClientLogos
- Default: `grayscale` → `grayscale-50`
- Card bg: `bg-white/5` → `bg-white/8`
- Card border: `border-white/8` → `border-white/14`

## Constraints
- No layout changes
- No animation changes
- No architecture changes
- Brand colors (#00e92c, #00ffff) unchanged
- Dark background (#050505) unchanged
