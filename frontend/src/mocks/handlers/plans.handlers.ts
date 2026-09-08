import { http, HttpResponse, delay } from 'msw';
import { MembershipPlan, CreatePlanPayload } from '@/features/plans/types';

let mockPlans: MembershipPlan[] = [
  {
    id: 'plan-301',
    tenantId: 'gym-demo',
    name: 'Standard Monthly',
    description: 'Basic access to gym floor and standard equipment.',
    type: 'MONTHLY',
    price: '49.99',
    durationDays: 30,
    status: 'OPEN',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'plan-302',
    tenantId: 'gym-demo',
    name: 'Premium Annual',
    description: 'All access pass including classes and pool.',
    type: 'ANNUAL',
    price: '499.99',
    durationDays: 365,
    status: 'OPEN',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
];

export const plansHandlers = [
  http.get('/api/v1/plans', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: {
        count: mockPlans.length,
        next: null,
        previous: null,
        results: [...mockPlans],
      },
    });
  }),

  http.get('/api/v1/plans/:id', async ({ params }) => {
    await delay(300);
    const plan = mockPlans.find((p) => p.id === params.id);
    if (!plan) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Plan not found' } },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: plan });
  }),

  http.post('/api/v1/plans', async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as CreatePlanPayload;
    const newPlan: MembershipPlan = {
      ...body,
      id: `plan-${Math.floor(Math.random() * 10000)}`,
      tenantId: 'gym-demo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPlans.push(newPlan);
    return HttpResponse.json({ success: true, data: newPlan }, { status: 201 });
  }),

  http.put('/api/v1/plans/:id', async ({ request, params }) => {
    await delay(600);
    const body = (await request.json()) as Partial<CreatePlanPayload>;
    const idx = mockPlans.findIndex((p) => p.id === params.id);
    if (idx < 0) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Plan not found' } },
        { status: 404 }
      );
    }
    mockPlans[idx] = { ...mockPlans[idx], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: mockPlans[idx] });
  }),

  http.delete('/api/v1/plans/:id', async ({ params }) => {
    await delay(400);
    mockPlans = mockPlans.filter((p) => p.id !== params.id);
    return HttpResponse.json({ success: true, data: null });
  }),
];
