---
paths:
  - lib/**/*.ts
---

# Data Rules — Agenz Website

## No Database

This project has no database. All content is **static TypeScript** exported from `/lib/`.

Do not add database connections, ORMs, or external CMS integrations.

## Data Files

| File | Purpose |
|------|---------|
| `lib/about-content.ts` | About page copy, stats, and section data |
| `lib/service-details-data.ts` | Service detail page content (Hero, Overview, Features, Case Study, FAQ, CTA) |
| Works data file(s) | Portfolio items for the Works page |

## Type Rules

- Export a TypeScript `interface` or `type` alongside every data array
- No `any` types — all data must be fully typed
- The `pricing` field was **removed** from the `Service` interface — **do NOT add it back**
  - If pricing context is needed, use "Contact for Quote" or "Schedule Consultation" language

## Adding New Content

### New service
Follow the existing structure in `service-details-data.ts`:
```
Hero → Overview → Feature Grid → Case Study Carousel → FAQ Accordion → CTA
```

### New portfolio work
Follow the existing structure in the works data file — include all required fields that the `Works` component expects.

### New about section
Add content to `about-content.ts` following the existing section shape. The three sections are: Hero, Mission, CTA.
