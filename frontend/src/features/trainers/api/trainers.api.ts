import api from '@/services/api';
import type { ApiResponse, PaginatedData } from '@/types/api';
import { Trainer, CreateTrainerPayload, UpdateTrainerPayload } from '../types';

export const trainersApi = {
  getTrainers: async (params?: Record<string, string>): Promise<PaginatedData<Trainer>> => {
    const response = await api.get<ApiResponse<PaginatedData<Trainer>>>('/trainers', { params });
    return response.data.data;
  },

  getTrainerById: async (id: string): Promise<Trainer> => {
    const response = await api.get<ApiResponse<Trainer>>(`/trainers/${id}`);
    return response.data.data;
  },

  createTrainer: async (payload: CreateTrainerPayload): Promise<Trainer> => {
    const response = await api.post<ApiResponse<Trainer>>('/trainers', payload);
    return response.data.data;
  },

  updateTrainer: async (id: string, payload: UpdateTrainerPayload): Promise<Trainer> => {
    const response = await api.put<ApiResponse<Trainer>>(`/trainers/${id}`, payload);
    return response.data.data;
  },

  deleteTrainer: async (id: string): Promise<void> => {
    await api.delete(`/trainers/${id}`);
  },
};
