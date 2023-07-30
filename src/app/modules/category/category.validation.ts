import { z } from 'zod';

export const createCategoryZodSchema = z.object({
  body: z.object({
    category: z.string({
      required_error: 'Category is required',
    }),
    featured: z.boolean({
      required_error: 'Featured status required',
    }),
  }),
});

export const updateCategoryZodSchema = z.object({
  body: z.object({
    category: z.string().optional(),
    featured: z.boolean().optional(),
  }),
});
