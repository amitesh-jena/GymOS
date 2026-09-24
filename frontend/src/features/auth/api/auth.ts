import api from '@/services/api';
import { ApiResponse } from '@/types/api';

import { User } from '@/types/identity';

export interface LoginPayload {
  email: string;
  password?: string;
  roleHint?: string; // used for simulator
}

export interface ConsentPayload {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  consent: ConsentPayload;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    return res.data.data;
  },

  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/signup', payload);
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
