import api from '@/services/api';
import { ApiResponse, PaginatedData } from '@/types/api';
import { MembershipPlan, CreatePlanPayload, UpdatePlanPayload } from '../types';

export const plansApi = {
  getPlans: async (params?: Record<string, string>): Promise<PaginatedData<MembershipPlan>> => {
    const response = await api.get<ApiResponse<PaginatedData<MembershipPlan>>>('/plans', {
      params,
    });
    return response.data.data;
  },

  getPlanById: async (id: string): Promise<MembershipPlan> => {
    const response = await api.get<ApiResponse<MembershipPlan>>(`/plans/${id}`);
    return response.data.data;
  },

  createPlan: async (payload: CreatePlanPayload): Promise<MembershipPlan> => {
    const response = await api.post<ApiResponse<MembershipPlan>>('/plans', payload);
    return response.data.data;
  },

  updatePlan: async (id: string, payload: UpdatePlanPayload): Promise<MembershipPlan> => {
    const response = await api.put<ApiResponse<MembershipPlan>>(`/plans/${id}`, payload);
    return response.data.data;
  },

  deletePlan: async (id: string): Promise<void> => {
    await api.delete(`/plans/${id}`);
  },
};
