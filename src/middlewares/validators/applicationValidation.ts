import { z } from 'zod';

export const applicationCreateSchema = z.object({
  courseId: z.string().uuid(),
  paymentMethod: z.enum(['TELEBIRR', 'CBE', 'AMOLE', 'OTHER']),
  paymentReference: z.string().min(3),
  marketingSource: z.string().optional(),
  fullName: z.string().min(3),
  dateOfBirth: z.string().datetime(),
  gender: z.string(),
  university: z.string().optional(),
  email: z.string().email(),
  phone: z.string(),
  telegramHandle: z.string().optional(),
  address: z.string()
});

export const applicationUpdateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  adminNotes: z.string().optional(),
  receiptVerified: z.boolean().optional()
});

export type ApplicationCreateInput = z.infer<typeof applicationCreateSchema>;
export type ApplicationUpdateInput = z.infer<typeof applicationUpdateSchema>;
