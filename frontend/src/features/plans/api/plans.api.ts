import api from '@/services/api';
import type { ApiResponse, PaginatedData } from '@/types/api';
import { MembershipPlan, CreatePlanPayload, UpdatePlanPayload } from '../types';
import { adaptMajorToMinor } from '@/utils/currency';

const adaptPlan = (p: MembershipPlan): MembershipPlan => ({
  ...p,
  priceMinorUnits: adaptMajorToMinor(p.price, 'USD')
});

export const plansApi = {
  getPlans: async (params?: Record<string, string>): Promise<PaginatedData<MembershipPlan>> => {
    const response = await api.get<ApiResponse<PaginatedData<MembershipPlan>>>('/plans', {
      params,
    });
    return {
      ...response.data.data,
      results: response.data.data.results.map(adaptPlan)
    };
  },

  getPlanById: async (id: string): Promise<MembershipPlan> => {
    const response = await api.get<ApiResponse<MembershipPlan>>(`/plans/${id}`);
    return adaptPlan(response.data.data);
  },

  createPlan: async (payload: CreatePlanPayload): Promise<MembershipPlan> => {
    const response = await api.post<ApiResponse<MembershipPlan>>('/plans', payload);
    return adaptPlan(response.data.data);
  },

  updatePlan: async (id: string, payload: UpdatePlanPayload): Promise<MembershipPlan> => {
    const response = await api.put<ApiResponse<MembershipPlan>>(`/plans/${id}`, payload);
    return adaptPlan(response.data.data);
  },

  deletePlan: async (id: string): Promise<void> => {
    await api.delete(`/plans/${id}`);
  },
};
