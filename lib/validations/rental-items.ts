import { z } from 'zod';

export const rentalItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  qty: z.number().int().min(1).default(1),
  available: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export type RentalItemInput = z.infer<typeof rentalItemSchema>;
