import { z } from 'zod';
export const receiptSchema = z.object({});
export type ReceiptFormData = z.infer<typeof receiptSchema>;
