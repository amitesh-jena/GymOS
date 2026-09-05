import { z } from 'zod';

export const membershipSchema = z.object({
  memberId: z.string().min(1, 'Member selection is required'),
  planId: z.string().min(1, 'Plan selection is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'FROZEN', 'EXPIRED', 'SUSPENDED']),
});

export type MembershipFormData = z.infer<typeof membershipSchema>;
