import { http, HttpResponse } from 'msw';
import { Payment } from '../../features/payments/types';
import { mockMembers } from './members.handlers';
import { mockMemberships } from './memberships.handlers';
import { MOCK_INVOICES } from './invoices.handlers';
import { MOCK_RECEIPTS } from './receipts.handlers';

export let MOCK_PAYMENTS: Payment[] = [
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
        results: [...MOCK_PAYMENTS].reverse(),
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
    const paymentId = 'pay-' + Date.now();

    const memberId = payload.memberId as string | undefined;
    let memberName = 'Unknown Member';

    if (memberId) {
      const member = mockMembers.find((m) => m.id === memberId);
      if (member) {
        memberName = `${member.firstName} ${member.lastName}`;
        member.status = 'ACTIVE';
      }
    }

    const membershipId = payload.membershipId as string | undefined;
    if (membershipId) {
      const ms = mockMemberships.find((m) => m.id === membershipId);
      if (ms) {
        ms.status = 'ACTIVE';
        ms.updatedAt = new Date().toISOString();
      }
    }

    const payment = {
      ...payload,
      id: paymentId,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      memberName,
    };

    MOCK_PAYMENTS.push(payment as unknown as Payment);

    MOCK_INVOICES.push({
      id: 'inv-' + Date.now(),
      tenantId: 'gym-demo',
      memberId: (payload.memberId as string) || '',
      memberName: memberName || 'Unknown Member',
      invoiceDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      status: 'PAID',
      subtotal: (payload.amount as string) || '0.00',
      tax: '0.00',
      discount: '0.00',
      total: (payload.amount as string) || '0.00',
      lineItems: [
        {
          id: 'li-1',
          description: 'Membership Payment',
          amount: (payload.amount as string) || '0.00',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    MOCK_RECEIPTS.push({
      id: 'rec-' + Date.now(),
      tenantId: 'gym-demo',
      memberId: (payload.memberId as string) || '',
      memberName: memberName || 'Unknown Member',
      paymentId: payment.id,
      amount: (payload.amount as string) || '0.00',
      receiptDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return HttpResponse.json({ success: true, data: payment }, { status: 201 });
  }),
];
