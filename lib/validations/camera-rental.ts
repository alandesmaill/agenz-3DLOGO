import { z } from 'zod';

export const cameraPackageSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  cameraBody: z.string().min(1),
  packageImage: z.string().min(1),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#00ffff'),
  highlights: z.array(z.string()).default([]),
  productionSetIncludes: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const equipmentCategorySchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  iconName: z.string().min(1),
  description: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const equipmentItemSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  qty: z.number().int().min(1).default(1),
  notes: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.number().int().default(0),
});
