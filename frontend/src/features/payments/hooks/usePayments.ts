import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPayments, getPayment, createPayment } from '../api/payments.api';

import { isAxiosError } from 'axios';
import { ApiError } from '@/types/api';
import { useToast } from '@/components/ui/use-toast';

export const usePayments = (page = 1) => {
  return useQuery({
    queryKey: ['payments', page],
    queryFn: () => getPayments(page),
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: () => getPayment(id),
    enabled: !!id,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({ title: 'Success', description: 'Payment recorded successfully.' });
    },
    onError: (error) => {
      let desc = 'An error occurred while creating the payment.';
      if (isAxiosError<ApiError>(error)) {
        desc = error.response?.data?.error?.message || desc;
      }
      toast({ title: 'Error', description: desc, variant: 'destructive' });
    },
  });
};
