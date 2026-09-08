import api from '@/services/api';
import type { ApiResponse, PaginatedData } from '@/types/api';
import { Workout, WorkoutCompletionPayload } from '../types';

export const getMemberWorkouts = (page = 1) => {
  return api
    .get<ApiResponse<PaginatedData<Workout>>>(`/workouts/me?page=${page}`)
    .then((res) => res.data.data);
};

export const completeWorkout = (payload: WorkoutCompletionPayload) => {
  return api
    .post<ApiResponse<Workout>>(`/workouts/${payload.workoutId}/complete`)
    .then((res) => res.data.data);
};
