import { z } from 'zod';

export const createProductSchemaZod = z.object({
  image: z.string({
    required_error: 'Image is required',
  }),
  productName: z.string({
    required_error: 'Product name is required',
  }),
  category: z.string({
    required_error: 'Category is required',
  }),
  status: z.enum(['In Stock', 'Out of Stock']),
  price: z.string({
    required_error: 'Price is required',
  }),
  description: z.string({
    required_error: 'Description is required',
  }),
  keyFeatures: z.array(z.string()).min(1, {
    message: 'At least one key feature is required',
  }),
  individualRating: z.number().min(1).max(5).default(5),
  averageRating: z.number().min(1).max(5).default(5),
  reviews: z.array(z.string()).default([]),
});
