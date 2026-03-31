import { z } from 'zod';

export const serviceSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  number: z.string().min(1),
  title: z.string().min(1),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#00ffff'),
  overviewDescription: z.string().min(1),
  overviewIconName: z.string().min(1),
  ctaText: z.string().default('Learn More'),
  ctaLink: z.string().min(1),
  heroTagline: z.string().min(1),
  heroDescription: z.string().min(1),
  heroStats: z.array(z.object({
    value: z.string().min(1),
    label: z.string().min(1),
  })).default([]),
  overviewHeading: z.string().min(1),
  overviewParagraphs: z.array(z.string()).default([]),
  overviewBenefits: z.array(z.string()).default([]),
  ctaHeading: z.string().min(1),
  ctaDescription: z.string().min(1),
  ctaButtonText: z.string().min(1),
  ctaButtonLink: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const serviceFeatureSchema = z.object({
  iconName: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  sortOrder: z.number().int().default(0),
});
