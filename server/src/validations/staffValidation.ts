import { z } from 'zod';

export const createStaffSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  email: z.string().trim().email('Invalid email address').max(50, 'Email must be less than 50 characters'),
  password: z.string().trim().min(4, 'Password must be at least 4 characters'),
  avatarUrl: z.string().trim().url('Invalid URL').nullable().optional(),
});

export const updateStaffSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name must be less than 50 characters').optional(),
  email: z.string().trim().email('Invalid email address').max(50, 'Email must be less than 50 characters').optional(),
  avatarUrl: z.string().trim().url('Invalid URL').nullable().optional(),
  isActive: z.boolean().optional(),
});

export const staffListQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().trim().optional(),
  isActive: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
});

export const staffIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid staff ID format'),
});
