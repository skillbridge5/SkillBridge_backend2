import { z } from 'zod';

export const applicationCreateSchema = z.object({
  courseId: z.string().uuid(),
  paymentMethod: z.string(),
  paymentReference: z.string().min(3).optional(),
  marketingSource: z.string().optional(),
  fullName: z.string().min(3),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.string(),
  nationality: z.string().optional(),
  university: z.string().optional(),
  email: z.string().email(),
  phone: z.string(),
  telegramHandle: z.string().optional(),
  address: z.string().optional(),
  paymentOption: z.string().optional(),
});

export const applicationUpdateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  adminNotes: z.string().optional(),
  receiptVerified: z.boolean().optional(),
  paymentOption: z.string().optional(),
});

export type ApplicationCreateInput = z.infer<typeof applicationCreateSchema>;
export type ApplicationUpdateInput = z.infer<typeof applicationUpdateSchema>;
