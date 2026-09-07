import api from '@/services/api';
import { ApiResponse } from '@/types/api';

export interface LoginPayload {
  email: string;
  password?: string;
  roleHint?: string; // used for simulator
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: string;
    tenantId: string;
  };
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refresh: async (): Promise<{ token: string }> => {
    const res = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return res.data.data;
  },

  passwordReset: async (email: string): Promise<void> => {
    await api.post('/auth/password-reset', { email });
  },

  passwordResetConfirm: async (payload: { token: string; password: string }): Promise<void> => {
    await api.post('/auth/password-reset/confirm', payload);
  },
};
