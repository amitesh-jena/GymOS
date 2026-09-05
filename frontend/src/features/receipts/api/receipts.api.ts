import api from '@/services/api';
import { PaginatedData, ApiResponse } from '@/types/api';
import { Receipt } from '../types';

export const getReceipts = async (page = 1) => {
  const { data } = await api.get<ApiResponse<PaginatedData<Receipt>>(`/receipts?page=${page}`);
  return data;
};
export const getReceipt = async (id: string) => {
  const { data } = await api.get<ApiResponse<Receipt>>(`/receipts/${id}`).then(res => res.data.data);
  return data;
};
