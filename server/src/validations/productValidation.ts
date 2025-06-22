import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Product name is required')
    .max(200, 'Product name must be less than 200 characters'),
  category: z
    .string()
    .min(1, 'Category ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format'),
  brand: z
    .string()
    .trim()
    .min(1, 'Brand is required')
    .max(100, 'Brand name must be less than 100 characters'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  originalPrice: z
    .number()
    .min(0, 'Original price must be greater than or equal to 0')
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(2000, 'Description must be less than 2000 characters'),
  images: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required'),
  specifications: z.object({
    weight: z.string().trim().optional(),
    size: z.string().trim().optional(),
    material: z.string().trim().optional(),
    color: z.string().trim().optional(),
    ingredients: z.array(z.string()).default([]),
  }),
  stock: z.number().min(0, 'Stock cannot be negative'),
  tags: z.array(z.string()).default([]),
  gifts: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const productFiltersSchema = z.object({
  category: z.string().optional().refine((val) => {
    // Allow empty string, 'all', valid ObjectId, or any other string (will be handled as category name)
    if (!val || val === 'all') return true;
    // Allow any string - will be validated in service layer
    return typeof val === 'string';
  }, { message: 'Category must be a valid string' }),
  brand: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  inStock: z.preprocess(
    (val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      if (typeof val === 'boolean') return val;
      return undefined;
    },
    z.boolean().optional()
  ),
  isActive: z.preprocess(
    (val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      if (typeof val === 'boolean') return val;
      return undefined;
    },
    z.boolean().optional()
  ),
  page: z.preprocess(
    (val) => {
      if (typeof val === 'string') return parseInt(val, 10);
      if (typeof val === 'number') return val;
      return 1;
    },
    z.number().int().positive().default(1)
  ),
  limit: z.preprocess(
    (val) => {
      if (typeof val === 'string') return parseInt(val, 10);
      if (typeof val === 'number') return val;
      return 15;
    },
    z.number().int().positive().default(15)
  ),
  sortBy: z.enum(['name', 'price', 'createdAt', 'rating']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
