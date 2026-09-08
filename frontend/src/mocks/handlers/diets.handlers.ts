import { http, HttpResponse, delay } from 'msw';
import { DietPlan } from '@/features/diets/types';

const mockDiets: DietPlan[] = [
  {
    id: 'diet-1',
    memberId: 'mem-1',
    name: 'Cutting Phase',
    dateAssigned: new Date().toISOString(),
    totalCalories: 1800,
    meals: [
      {
        id: 'meal-1',
        timing: 'Breakfast',
        name: 'Oatmeal & Eggs',
        calories: 400,
        macros: { p: 30, c: 45, f: 10 },
      },
      {
        id: 'meal-2',
        timing: 'Lunch',
        name: 'Chicken Salad',
        calories: 500,
        macros: { p: 50, c: 20, f: 15 },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const dietsHandlers = [
  http.get('/api/v1/diets/me', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: { count: mockDiets.length, next: null, previous: null, results: mockDiets },
    });
  }),
];
