export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'VOID' | 'OVERDUE';

export interface InvoiceLineItem {
  id: string;
  description: string;
  amount: string;
}

export interface Invoice {
  id: string;
  tenantId: string;
  memberId: string;
  memberName: string;
  membershipId?: string;
  paymentId?: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotal: string;
  tax: string;
  discount: string;
  total: string;
  lineItems: InvoiceLineItem[];
  createdAt: string;
  updatedAt: string;
}
