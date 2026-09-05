import { z } from 'zod';

export const memberSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is too short').max(20),
  branchId: z.string().min(1, 'Branch assignment is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'FROZEN', 'LEAD']),
  joinDate: z.string().min(1, 'Join date is required'),
  notes: z.string().max(500).optional(),
});

export type MemberFormData = z.infer<typeof memberSchema>;
