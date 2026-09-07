import { http, HttpResponse, delay } from 'msw';
import { Membership, CreateMembershipPayload } from '@/features/memberships/types';
import { MOCK_PAYMENTS } from './payments.handlers';
import { MOCK_INVOICES } from './invoices.handlers';
import { MOCK_RECEIPTS } from './receipts.handlers';
import { mockMembers } from './members.handlers';

export let mockMemberships: Membership[] = [
  {
    id: 'mshp-401',
    tenantId: 'gym-demo',
    memberId: 'mem-101',
    planId: 'plan-301',
    startDate: '2025-01-15T00:00:00Z',
    endDate: '2025-02-15T00:00:00Z',
    status: 'ACTIVE',
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
  },
];

export const membershipsHandlers = [
  http.get('/api/v1/memberships', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: {
        count: mockMemberships.length,
        next: null,
        previous: null,
        results: [...mockMemberships],
      },
    });
  }),

  http.get('/api/v1/memberships/:id', async ({ params }) => {
    await delay(300);
    const mshp = mockMemberships.find((p) => p.id === params.id);
    if (!mshp) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Membership not found' } },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: mshp });
  }),

  http.post('/api/v1/memberships', async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as CreateMembershipPayload;
    const newMshp: Membership = {
      ...body,
      id: `mshp-${Math.floor(Math.random() * 10000)}`,
      tenantId: 'gym-demo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockMemberships.push(newMshp);
    return HttpResponse.json({ success: true, data: newMshp }, { status: 201 });
  }),

  http.put('/api/v1/memberships/:id', async ({ request, params }) => {
    await delay(600);
    const body = (await request.json()) as Partial<CreateMembershipPayload>;
    const idx = mockMemberships.findIndex((p) => p.id === params.id);
    if (idx < 0) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Membership not found' } },
        { status: 404 }
      );
    }
    mockMemberships[idx] = {
      ...mockMemberships[idx],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, data: mockMemberships[idx] });
  }),

  http.post('/api/v1/memberships/:id/renew', async ({ request, params }) => {
    await delay(600);
    const body = (await request.json()) as { planId: string; startDate: string; endDate: string };
    const mshp = mockMemberships.find((p) => p.id === params.id);
    if (!mshp) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Membership not found' } },
        { status: 404 }
      );
    }

    mshp.planId = body.planId;
    mshp.startDate = body.startDate;
    mshp.endDate = body.endDate;
    mshp.status = 'ACTIVE';
    mshp.updatedAt = new Date().toISOString();

    const paymentId = 'pay-rnw-' + Date.now();
    const amount = '99.00';
    let memberName = 'Unknown Member';
    const member = mockMembers.find((m) => m.id === mshp.memberId);
    if (member) {
      memberName = `${member.firstName} ${member.lastName}`;
      member.status = 'ACTIVE';
    }

    MOCK_PAYMENTS.push({
      id: paymentId,
      tenantId: 'gym-demo',
      memberId: mshp.memberId,
      memberName,
      amount,
      currency: 'USD',
      method: 'CARD',
      status: 'COMPLETED',
      paymentDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as unknown as import('../../features/payments/types').Payment);

    MOCK_INVOICES.push({
      id: 'inv-rnw-' + Date.now(),
      tenantId: 'gym-demo',
      memberId: mshp.memberId,
      memberName,
      invoiceDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      status: 'PAID',
      subtotal: amount,
      total: amount,
      tax: '0.00',
      discount: '0.00',
      lineItems: [{ id: 'li-1', description: 'Membership Renewal', amount }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    MOCK_RECEIPTS.push({
      id: 'rec-rnw-' + Date.now(),
      tenantId: 'gym-demo',
      memberId: mshp.memberId,
      memberName,
      paymentId,
      amount,
      receiptDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return HttpResponse.json({ success: true, data: mshp });
  }),
];
