import api from '@/services/api';
import type { ApiResponse, PaginatedData } from '@/types/api';
import { DietPlan } from '../types';

export const getMemberDiets = (page = 1) => {
  return api
    .get<ApiResponse<PaginatedData<DietPlan>>>(`/diets/me?page=${page}`)
    .then((res) => res.data.data);
};
