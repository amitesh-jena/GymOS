import { http, HttpResponse, delay } from 'msw';
import { Trainer, CreateTrainerPayload } from '@/features/trainers/types';

let mockTrainers: Trainer[] = [
  {
    id: 'trn-201',
    tenantId: 'gym-demo',
    branchId: 'branch-hk',
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'marcus.j@example.com',
    phone: '555-0301',
    specialization: 'Powerlifting, Functional',
    status: 'ACTIVE',
    createdAt: '2024-05-10T08:00:00Z',
    updatedAt: '2024-05-10T08:00:00Z',
  },
];

export const trainersHandlers = [
  http.get('/api/v1/trainers', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: {
        count: mockTrainers.length,
        next: null,
        previous: null,
        results: [...mockTrainers],
      },
    });
  }),

  http.get('/api/v1/trainers/:id', async ({ params }) => {
    await delay(300);
    const trainer = mockTrainers.find((t) => t.id === params.id);
    if (!trainer) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Trainer not found' } },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: trainer });
  }),

  http.post('/api/v1/trainers', async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as CreateTrainerPayload;
    const newTrainer: Trainer = {
      ...body,
      id: `trn-${Math.floor(Math.random() * 10000)}`,
      tenantId: 'gym-demo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTrainers.push(newTrainer);
    return HttpResponse.json({ success: true, data: newTrainer }, { status: 201 });
  }),

  http.put('/api/v1/trainers/:id', async ({ request, params }) => {
    await delay(600);
    const body = (await request.json()) as Partial<CreateTrainerPayload>;
    const idx = mockTrainers.findIndex((t) => t.id === params.id);
    if (idx < 0) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Trainer not found' } },
        { status: 404 }
      );
    }
    mockTrainers[idx] = { ...mockTrainers[idx], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: mockTrainers[idx] });
  }),

  http.delete('/api/v1/trainers/:id', async ({ params }) => {
    await delay(400);
    mockTrainers = mockTrainers.filter((t) => t.id !== params.id);
    return HttpResponse.json({ success: true, data: null });
  }),
];
