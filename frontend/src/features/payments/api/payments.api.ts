import api from '@/services/api';
import type { ApiResponse, PaginatedData } from '@/types/api';
import { Payment, CreatePaymentPayload } from '../types';
import { adaptMajorToMinor } from '@/utils/currency';

const adaptPayment = (p: Payment): Payment => ({
  ...p,
  amountMinorUnits: adaptMajorToMinor(p.amount, p.currency)
});

export const getPayments = async (page = 1) => {
  const { data } = await api.get<ApiResponse<PaginatedData<Payment>>>(`/payments?page=${page}`);
  return {
    ...data.data,
    results: data.data.results.map(adaptPayment)
  };
};

export const getPayment = async (id: string) => {
  const { data } = await api.get<ApiResponse<Payment>>(`/payments/${id}`);
  return adaptPayment(data.data);
};

export const createPayment = async (payload: CreatePaymentPayload) => {
  const { data } = await api.post<ApiResponse<Payment>>('/payments', payload);
  return adaptPayment(data.data);
};
