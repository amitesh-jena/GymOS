import { z } from 'zod';

export const trainerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is too short').max(20),
  branchId: z.string().min(1, 'Branch assignment is required'),
  specialization: z.string().max(100).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export type TrainerFormData = z.infer<typeof trainerSchema>;
