import api from '@/services/api';
import type { ApiResponse, PaginatedData } from '@/types/api';
import { Membership, CreateMembershipPayload } from '../types';

export const membershipsApi = {
  getMemberships: async (params?: Record<string, string>): Promise<PaginatedData<Membership>> => {
    const response = await api.get<ApiResponse<PaginatedData<Membership>>>('/memberships', {
      params,
    });
    return response.data.data;
  },

  getMembershipById: async (id: string): Promise<Membership> => {
    const response = await api.get<ApiResponse<Membership>>(`/memberships/${id}`);
    return response.data.data;
  },

  createMembership: async (payload: CreateMembershipPayload): Promise<Membership> => {
    const response = await api.post<ApiResponse<Membership>>('/memberships', payload);
    return response.data.data;
  },

  updateMembership: async (
    id: string,
    payload: Partial<CreateMembershipPayload>
  ): Promise<Membership> => {
    const response = await api.put<ApiResponse<Membership>>(`/memberships/${id}`, payload);
    return response.data.data;
  },

  renewMembership: async (
    id: string,
    payload: { planId: string; startDate: string; endDate: string }
  ): Promise<Membership> => {
    const response = await api.post<ApiResponse<Membership>>(`/memberships/${id}/renew`, payload);
    return response.data.data;
  },
};
