import api from '@/services/api';
import type { ApiResponse, PaginatedData } from '@/types/api';
import { Member, CreateMemberPayload, UpdateMemberPayload } from '../types';

export const membersApi = {
  getMembers: async (params?: Record<string, string>): Promise<PaginatedData<Member>> => {
    const response = await api.get<ApiResponse<PaginatedData<Member>>>('/members', { params });
    return response.data.data;
  },

  getMemberById: async (id: string): Promise<Member> => {
    const response = await api.get<ApiResponse<Member>>(`/members/${id}`);
    return response.data.data;
  },

  createMember: async (payload: CreateMemberPayload): Promise<Member> => {
    const response = await api.post<ApiResponse<Member>>('/members', payload);
    return response.data.data;
  },

  updateMember: async (id: string, payload: UpdateMemberPayload): Promise<Member> => {
    const response = await api.put<ApiResponse<Member>>(`/members/${id}`, payload);
    return response.data.data;
  },

  deleteMember: async (id: string): Promise<void> => {
    await api.delete(`/members/${id}`);
  },
};
