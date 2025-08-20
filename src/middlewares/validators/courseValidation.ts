import { z } from 'zod';

export const courseModuleSchema = z.object({
  title: z.string().min(1, 'Module title is required').max(200, 'Module title too long'),
  duration: z.string().min(1, 'Module duration is required').max(50, 'Module duration too long'),
  lessons: z.array(z.object({
    title: z.string().min(1, 'Lesson title is required').max(200, 'Lesson title too long'),
    duration: z.string().optional().default('30 min')
  })).optional().default([])
});

export const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(500, 'Short description too long'),
  detailedDescription: z.string().min(20, 'Detailed description must be at least 20 characters').max(5000, 'Detailed description too long'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  priceOriginal: z.number().positive('Price must be positive').min(0, 'Price cannot be negative'),
  priceDiscounted: z.number().positive('Discounted price must be positive').min(0, 'Discounted price cannot be negative'),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']),
  duration: z.string().min(1, 'Duration is required'),
  categoryId: z.string().uuid('Invalid category ID'),
  instructorId: z.string().uuid('Invalid instructor ID'),
  slug: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().min(0).optional(),
  students: z.number().min(0).optional(),
  enrollmentYear: z.number().min(2000).max(2030).optional(),
  learningOutcomes: z.array(z.string().min(1, 'Learning outcome cannot be empty')).optional().default([]),
  prerequisites: z.array(z.string().min(1, 'Prerequisite cannot be empty')).optional().default([]),
  curriculum: z.array(courseModuleSchema).optional().default([])
});

export const updateCourseSchema = createCourseSchema.partial();
