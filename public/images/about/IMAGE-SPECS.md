# About Page - Image Specifications

Place your images in the corresponding folders below.

---

## /hero/
**Full-screen hero background** (replaces green→cyan gradient)
- Size: **1920 x 1080px** (16:9, full HD)
- Bleed: Full edge-to-edge, no safe margins on edges
- Safe zone for text: Center ~1152px wide area (white headline overlays)
- Format: JPG or WebP (keep under 300KB for performance)
- Naming: `hero-bg.jpg` or `hero-bg.webp`
- Notes: Image should be dark enough for white text readability, or an overlay will be added

## /mission/
**Full-screen mission section background** (replaces cyan→green gradient)
- Size: **1920 x 1080px** (16:9, full HD)
- Bleed: Full edge-to-edge
- Safe zone: Left half = glass card with text, Right half = stats grid
- Format: JPG or WebP (keep under 300KB)
- Naming: `mission-bg.jpg` or `mission-bg.webp`
- Notes: Content has glass blur cards on top, so background shows through partially

## /team/
**Team member photos**
- Portrait size: **400 x 500px** (4:5 ratio) per team member
- OR Square size: **400 x 400px** (1:1 ratio) per team member
- Format: JPG or WebP (keep each under 100KB)
- Naming: `team-member-name.jpg` (e.g., `john-doe.jpg`)
- Notes: Currently a placeholder section ("Coming soon")

**Optional team section background:**
- Size: **1920 x 800px** (wide banner)
- Naming: `team-bg.jpg`

## /cta/
**Full-screen CTA section background** (replaces green→cyan gradient)
- Size: **1920 x 1080px** (16:9, full HD)
- Bleed: Full edge-to-edge
- Safe zone: Center area (white headline + button overlay)
- Format: JPG or WebP (keep under 300KB)
- Naming: `cta-bg.jpg` or `cta-bg.webp`
- Notes: Needs to support white text readability

## /clients/
**Client logos** (additional logos beyond existing 9)
- Size: **256 x 192px** (4:3 ratio, 2x retina)
- Display size: 96-128px wide, 64-96px tall
- Format: SVG preferred, or PNG with transparency
- Naming: `client-name.svg` or `client-name.png`
- Notes: Existing logos are in `/public/images/clients/` - this folder is for new additions
- Existing: fibernet, iq-labs, iq-online, kurdsat-towers, mj-holding, optiq, rover-city, vq, white-towers

---

## Quick Reference Table

| Section       | Folder     | Size (px)      | Ratio | Format     | Max File Size |
|---------------|------------|----------------|-------|------------|---------------|
| Hero BG       | /hero/     | 1920 x 1080    | 16:9  | JPG/WebP   | 300KB         |
| Mission BG    | /mission/  | 1920 x 1080    | 16:9  | JPG/WebP   | 300KB         |
| Team Photos   | /team/     | 400 x 500      | 4:5   | JPG/WebP   | 100KB each    |
| Team BG       | /team/     | 1920 x 800     | 12:5  | JPG/WebP   | 300KB         |
| CTA BG        | /cta/      | 1920 x 1080    | 16:9  | JPG/WebP   | 300KB         |
| Client Logos  | /clients/  | 256 x 192      | 4:3   | SVG/PNG    | 50KB each     |

## Retina Support
All sizes above are for standard displays. For retina (2x):
- Background images: 3840 x 2160px (4K) - optional, increases file size
- Team photos: 800 x 1000px
- Client logos: Already 2x at 256 x 192px
