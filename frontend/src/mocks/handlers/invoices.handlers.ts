import { http, HttpResponse } from 'msw';
import { Invoice } from '@/features/invoices/types';

export let MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    tenantId: 'tenant-1',
    memberId: 'mem-1',
    memberName: 'John Doe',
    invoiceDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    status: 'PAID',
    subtotal: '50.00',
    tax: '0.00',
    discount: '0.00',
    total: '50.00',
    lineItems: [{ id: 'li-1', description: 'Monthly Gym', amount: '50.00' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const invoicesHandlers = [
  http.get('/api/v1/invoices', () => {
    return HttpResponse.json({
      success: true,
      data: {
        count: MOCK_INVOICES.length,
        next: null,
        previous: null,
        results: MOCK_INVOICES,
      },
    });
  }),
  http.get('/api/v1/invoices/:id', ({ params }) => {
    const invoice = MOCK_INVOICES.find((p) => p.id === params.id);
    if (!invoice) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ success: true, data: invoice });
  }),
];
