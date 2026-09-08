import { z } from 'zod';

export const paymentSchema = z.object({
  memberId: z.string().min(1, 'Member selection is required'),
  membershipId: z.string().optional(),
  invoiceId: z.string().optional(),
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Must be a positive amount'),
  currency: z.string(),
  method: z.enum(['CASH', 'UPI', 'CARD', 'ONLINE']),
  transactionId: z.string().optional(),
  paymentDate: z.string().min(1, 'Payment date is required'),
  notes: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
