import { http, HttpResponse, delay } from 'msw';
import { Workout } from '@/features/workouts/types';

export let mockWorkouts: Workout[] = [
  {
    id: 'wk-1',
    memberId: 'mem-1',
    name: 'Upper Body Power',
    dateAssigned: new Date().toISOString(),
    status: 'PENDING',
    exercises: [
      { id: 'ex-1', name: 'Bench Press', sets: 4, reps: 8 },
      { id: 'ex-2', name: 'Pull-ups', sets: 3, reps: 10 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const workoutsHandlers = [
  http.get('/api/v1/workouts/me', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: { count: mockWorkouts.length, next: null, previous: null, results: mockWorkouts },
    });
  }),
  http.post('/api/v1/workouts/:id/complete', async ({ params }) => {
    await delay(500);
    const wk = mockWorkouts.find((w) => w.id === params.id);
    if (!wk) return new HttpResponse(null, { status: 404 });
    wk.status = 'COMPLETED';
    return HttpResponse.json({ success: true, data: wk });
  }),
  http.post('/api/v1/workouts', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, unknown>;
    const newWk = {
      ...body,
      id: 'wk-' + Date.now(),
      status: 'PENDING',
      dateAssigned: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as unknown as Workout;
    mockWorkouts.push(newWk);
    return HttpResponse.json({ success: true, data: newWk });
  }),
];
