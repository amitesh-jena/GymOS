import { z } from 'zod';

export const checkInSchema = z.object({
  memberId: z.string().min(1, 'Member selection is required'),
  branchId: z.string(),
  checkInTime: z.string().min(1, 'Check-in time is required'),
  source: z.enum(['MANUAL', 'QR', 'CARD']),
  notes: z.string().max(250).optional(),
});

export type CheckInFormData = z.infer<typeof checkInSchema>;
