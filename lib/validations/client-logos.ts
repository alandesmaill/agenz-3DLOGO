import { z } from 'zod';

export const clientLogoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image: z.string().min(1, 'Image URL is required'),
  sortOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

export type ClientLogoInput = z.infer<typeof clientLogoSchema>;
