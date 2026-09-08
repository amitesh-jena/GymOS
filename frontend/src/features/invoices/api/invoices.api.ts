import api from '@/services/api';
import type { ApiResponse, PaginatedData } from '@/types/api';
import { Invoice } from '../types';

export const getInvoices = async (page = 1) => {
  const { data } = await api.get<ApiResponse<PaginatedData<Invoice>>>(`/invoices?page=${page}`);
  return data.data;
};
export const getInvoice = async (id: string) => {
  const { data } = await api.get<ApiResponse<Invoice>>(`/invoices/${id}`);
  return data.data;
};
