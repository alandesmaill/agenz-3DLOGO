# About Page Redesign — Editorial / Magazine (Light Elevated)

**Date:** 2026-02-19
**Status:** Approved

## Goal

Elevate the existing light-theme About page from a generic white layout to a premium editorial feel — keeping the light base but bringing in brand identity (green/cyan gradient accents, stronger typography hierarchy, larger decorative shapes).

## Approved Approach: Editorial / Magazine

### Global Background
- Base color: `#f5f4f0` (warm cream, replacing flat `#f7f7f7`)
- Radial gradient halos: green top-left and cyan top-right at ~12–15% opacity (up from 6–7%)

---

## Section 1 — Hero

| Element | Change |
|---|---|
| Accent line | Add thin 2px gradient rule (`from-[#00e92c] to-[#00ffff]`) above "WELCOME TO" |
| "WELCOME TO" | Wider letter-spacing, reads as a label/eyebrow |
| "AGENZ" | Gradient text fill (green → cyan) via `background-clip: text` |
| Tagline | Drop to `font-semibold`, tint to `text-gray-600` for hierarchy contrast |
| Flower image | Full opacity (`opacity-100`), larger, bleeds off right edge intentionally |

---

## Section 2 — Mission

| Element | Change |
|---|---|
| Glass card | 4px left green border accent (`border-l-4 border-[#00e92c]`) |
| "Our Mission" label | Gradient text fill (green → cyan) |
| Stat numbers | Gradient text fill (green → cyan) |
| Stat cards | Faint green/cyan border (`border border-green-200`) always on |

---

## Section 3 — CTA

| Element | Change |
|---|---|
| Headline | Gradient text fill (green → cyan) |
| Background watermark | Large faint "AGENZ" text behind headline (opacity ~5%) as texture |
| Graphics shape | Higher opacity, slightly larger |
| CTA button | Add green glow shadow `shadow-[0_0_40px_rgba(0,233,44,0.3)]` |

---

## Files to Modify

- `components/dom/AboutSection.tsx` — all visual changes
- `lib/about-content.ts` — no content changes needed

## Out of Scope

- No layout restructuring (section order stays the same)
- No new sections
- No changes to animations (GSAP timelines stay intact)
- No dark mode
