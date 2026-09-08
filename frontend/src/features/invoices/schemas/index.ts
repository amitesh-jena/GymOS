import { z } from 'zod';
export const invoiceSchema = z.object({});
export type InvoiceFormData = z.infer<typeof invoiceSchema>;
