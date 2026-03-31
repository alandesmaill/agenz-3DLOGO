import { z } from 'zod';

export const portfolioProjectSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  category: z.enum(['brand-identity', 'digital-campaigns', 'video-production', 'event-branding']),
  clientName: z.string().min(1),
  projectTitle: z.string().min(1),
  year: z.string().min(4),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#00e92c'),
  sortOrder: z.number().int().default(0),
  published: z.boolean().default(true),
  thumbnailImage: z.string().min(1),
  thumbnailAlt: z.string().min(1),
  heroCoverImage: z.string().min(1),
  heroTagline: z.string().min(1),
  heroDescription: z.string().min(1),
  overviewChallenge: z.string().min(1),
  overviewSolution: z.string().min(1),
  overviewApproach: z.array(z.string()).default([]),
  overviewDeliverables: z.array(z.string()).default([]),
  beforeImage: z.string().optional(),
  afterImage: z.string().optional(),
  beforeAfterDesc: z.string().optional(),
  testimonialQuote: z.string().min(1),
  testimonialAuthor: z.string().min(1),
  testimonialRole: z.string().min(1),
  testimonialCompany: z.string().min(1),
  relatedSlugs: z.array(z.string()).default([]),
});

export const heroStatSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

export const galleryItemSchema = z.object({
  type: z.enum(['image', 'video']),
  src: z.string().min(1),
  alt: z.string().optional(),
  thumbnail: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const projectResultSchema = z.object({
  metric: z.string().min(1),
  value: z.string().min(1),
  label: z.string().min(1),
  sortOrder: z.number().int().default(0),
});
