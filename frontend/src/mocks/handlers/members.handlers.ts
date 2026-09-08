import { http, HttpResponse, delay } from 'msw';
import { Member, CreateMemberPayload } from '@/features/members/types';

export let mockMembers: Member[] = [
  {
    id: 'mem-101',
    tenantId: 'gym-demo',
    branchId: 'branch-hk',
    firstName: 'Alex',
    lastName: 'Chen',
    email: 'alex.chen@example.com',
    phone: '555-0101',
    status: 'ACTIVE',
    joinDate: '2025-01-15',
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'mem-102',
    tenantId: 'gym-demo',
    branchId: 'branch-hk',
    firstName: 'Sarah',
    lastName: 'Miller',
    email: 'sarah.m@example.com',
    phone: '555-0102',
    status: 'INACTIVE',
    joinDate: '2024-11-01',
    createdAt: '2024-11-01T10:30:00Z',
    updatedAt: '2025-02-28T14:20:00Z',
  },
];

export const membersHandlers = [
  http.get('/api/v1/members', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: {
        count: mockMembers.length,
        next: null,
        previous: null,
        results: [...mockMembers],
      },
    });
  }),

  http.get('/api/v1/members/:id', async ({ params }) => {
    await delay(300);
    const member = mockMembers.find((m) => m.id === params.id);
    if (!member) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Member not found' } },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: member });
  }),

  http.post('/api/v1/members', async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as CreateMemberPayload;
    const newMember: Member = {
      ...body,
      id: `mem-${Math.floor(Math.random() * 10000)}`,
      tenantId: 'gym-demo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockMembers.push(newMember);
    return HttpResponse.json({ success: true, data: newMember }, { status: 201 });
  }),

  http.put('/api/v1/members/:id', async ({ request, params }) => {
    await delay(600);
    const body = (await request.json()) as Partial<CreateMemberPayload>;
    const idx = mockMembers.findIndex((m) => m.id === params.id);
    if (idx < 0) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Member not found' } },
        { status: 404 }
      );
    }
    mockMembers[idx] = { ...mockMembers[idx], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: mockMembers[idx] });
  }),

  http.delete('/api/v1/members/:id', async ({ params }) => {
    await delay(400);
    mockMembers = mockMembers.filter((m) => m.id !== params.id);
    return HttpResponse.json({ success: true, data: null });
  }),
];
