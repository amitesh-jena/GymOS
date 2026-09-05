import { http, HttpResponse, delay } from 'msw';
import { ProgressRecord } from '@/features/progress/types';

const mockProgress: ProgressRecord[] = [
  {
    id: 'prg-1',
    memberId: 'mem-1',
    date: '2025-01-01T00:00:00Z',
    weight: 190,
    bodyFatPercentage: 20,
  },
  {
    id: 'prg-2',
    memberId: 'mem-1',
    date: '2025-01-15T00:00:00Z',
    weight: 188,
    bodyFatPercentage: 19,
  },
  {
    id: 'prg-3',
    memberId: 'mem-1',
    date: '2025-02-01T00:00:00Z',
    weight: 185,
    bodyFatPercentage: 18,
  },
  {
    id: 'prg-4',
    memberId: 'mem-1',
    date: '2025-02-15T00:00:00Z',
    weight: 183,
    bodyFatPercentage: 17,
  },
];

export const progressHandlers = [
  http.get('/api/v1/progress/me', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: { count: mockProgress.length, next: null, previous: null, results: mockProgress },
    });
  }),
];
