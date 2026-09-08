import api from '@/services/api';
import type { ApiResponse, PaginatedData } from '@/types/api';
import { Payment, CreatePaymentPayload } from '../types';

export const getPayments = async (page = 1) => {
  const { data } = await api.get<ApiResponse<PaginatedData<Payment>>>(`/payments?page=${page}`);
  return data.data;
};

export const getPayment = async (id: string) => {
  const { data } = await api.get<ApiResponse<Payment>>(`/payments/${id}`);
  return data.data;
};

export const createPayment = async (payload: CreatePaymentPayload) => {
  const { data } = await api.post<ApiResponse<Payment>>('/payments', payload);
  return data.data;
};
