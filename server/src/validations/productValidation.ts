import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Product name is required')
    .max(200, 'Product name must be less than 200 characters'),
  category: z.enum(['Food', 'Toy', 'Accessory', 'Healthcare', 'Grooming', 'Other'], {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  subcategory: z
    .string()
    .trim()
    .max(100, 'Subcategory must be less than 100 characters')
    .optional(),
  brand: z
    .string()
    .trim()
    .min(1, 'Brand is required')
    .max(100, 'Brand name must be less than 100 characters'),
  price: z
    .number()
    .min(0, 'Price must be greater than or equal to 0'),
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
    ageGroup: z.string().trim().optional(),
    petType: z.array(z.string()).default([]),
    ingredients: z.array(z.string()).default([]),
  }),
  stock: z
    .number()
    .min(0, 'Stock cannot be negative'),
  tags: z.array(z.string()).default([]),
  gifts: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const productFiltersSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  petType: z.string().optional(),
  inStock: z.boolean().optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(15),
  sortBy: z.enum(['name', 'price', 'rating', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});