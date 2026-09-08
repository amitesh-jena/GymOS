import api from '@/services/api';
import type { ApiResponse, PaginatedData } from '@/types/api';
import { ProgressRecord } from '../types';

export const getMemberProgress = () => {
  return api
    .get<ApiResponse<PaginatedData<ProgressRecord>>>('/progress/me')
    .then((res) => res.data.data);
};
