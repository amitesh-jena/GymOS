export interface Receipt {
  id: string;
  tenantId: string;
  memberId: string;
  memberName: string;
  invoiceId?: string;
  paymentId: string;
  amount: string;
  receiptDate: string;
  createdAt: string;
  updatedAt: string;
}
