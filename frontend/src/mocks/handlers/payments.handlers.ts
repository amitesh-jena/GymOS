import { http, HttpResponse } from 'msw';
import { Payment } from '../../features/payments/types';

const MOCK_PAYMENTS = [
  {
    id: 'pay-1',
    tenantId: 'tenant-1',
    memberId: 'mem-1',
    memberName: 'John Doe',
    amount: '50.00',
    currency: 'USD',
    method: 'CARD',
    status: 'COMPLETED',
    paymentDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const paymentsHandlers = [
  http.get('/api/v1/payments', () => {
    return HttpResponse.json({
      success: true,
      data: {
        count: MOCK_PAYMENTS.length,
        next: null,
        previous: null,
        results: MOCK_PAYMENTS,
      },
    });
  }),
  http.get('/api/v1/payments/:id', ({ params }) => {
    const payment = MOCK_PAYMENTS.find((p) => p.id === params.id);
    if (!payment) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ success: true, data: payment });
  }),
  http.post('/api/v1/payments', async ({ request }) => {
    const payload = (await request.json()) as Record<string, unknown>;
    const payment = {
      ...payload,
      id: 'pay-' + Date.now(),
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      memberName: 'Unknown Member',
    };
    MOCK_PAYMENTS.push(payment as unknown as Payment);
    return HttpResponse.json({ success: true, data: payment });
  }),
];
