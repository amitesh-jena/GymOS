import { useQuery } from '@tanstack/react-query';
import { getInvoices, getInvoice } from '../api/invoices.api';

export const useInvoices = (page = 1) => {
  return useQuery({
    queryKey: ['invoices', page],
    queryFn: () => getInvoices(page),
  });
};
export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => getInvoice(id),
    enabled: !!id,
  });
};
