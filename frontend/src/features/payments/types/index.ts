export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'ONLINE';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Payment {
  id: string;
  tenantId: string;
  memberId: string;
  memberName: string;
  membershipId?: string;
  invoiceId?: string;
  receiptId?: string;
  amount: string;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentPayload {
  memberId: string;
  membershipId?: string;
  invoiceId?: string;
  amount: string;
  currency: string;
  method: PaymentMethod;
  transactionId?: string;
  paymentDate: string;
  notes?: string;
}
