import { http, HttpResponse } from 'msw';

const MOCK_RECEIPTS = [
  {
    id: 'rec-1',
    tenantId: 'tenant-1',
    memberId: 'mem-1',
    memberName: 'John Doe',
    paymentId: 'pay-1',
    amount: '50.00',
    receiptDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const receiptsHandlers = [
  http.get('/api/v1/receipts', () => {
    return HttpResponse.json({
      success: true,
      data: {
        count: MOCK_RECEIPTS.length,
        next: null,
        previous: null,
        results: MOCK_RECEIPTS,
      },
    });
  }),
  http.get('/api/v1/receipts/:id', ({ params }) => {
    const receipt = MOCK_RECEIPTS.find((p) => p.id === params.id);
    if (!receipt) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ success: true, data: receipt });
  }),
];
