import { http, HttpResponse, delay } from 'msw';
import { Membership, CreateMembershipPayload } from '@/features/memberships/types';

let mockMemberships: Membership[] = [
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
];
