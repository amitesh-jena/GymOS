import { z } from 'zod';

export const planSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  type: z.enum([
    'MONTHLY',
    'QUARTERLY',
    'HALF_YEARLY',
    'ANNUAL',
    'CUSTOM',
    'PT_PACKAGE',
    'NUTRITION',
    'ADD_ON',
  ]),
  // Price expects a string representation of decimal, e.g. "99.99"
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid decimal amount (e.g. 99.99)'),
  durationDays: z.number().int().positive('Duration must be greater than 0 days'),
  status: z.enum(['OPEN', 'ARCHIVED']),
});

export type PlanFormData = z.infer<typeof planSchema>;
