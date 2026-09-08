import { useQuery } from '@tanstack/react-query';
import { getReceipts, getReceipt } from '../api/receipts.api';

export const useReceipts = (page = 1) => {
  return useQuery({
    queryKey: ['receipts', page],
    queryFn: () => getReceipts(page),
  });
};
export const useReceipt = (id: string) => {
  return useQuery({
    queryKey: ['receipts', id],
    queryFn: () => getReceipt(id),
    enabled: !!id,
  });
};
