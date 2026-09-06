import { isAxiosError } from 'axios';
import { ApiError } from '@/types/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipsApi } from '../api/memberships.api';
import { CreateMembershipPayload } from '../types';
import { useToast } from '@/components/ui/use-toast';

const MEMBERSHIP_KEYS = {
  all: ['memberships'] as const,
  lists: () => [...MEMBERSHIP_KEYS.all, 'list'] as const,
  list: (filters: string) => [...MEMBERSHIP_KEYS.lists(), { filters }] as const,
  details: () => [...MEMBERSHIP_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...MEMBERSHIP_KEYS.details(), id] as const,
};

export const useMemberships = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: MEMBERSHIP_KEYS.list(JSON.stringify(params || {})),
    queryFn: () => membershipsApi.getMemberships(params),
  });
};

export const useMembership = (id: string) => {
  return useQuery({
    queryKey: MEMBERSHIP_KEYS.detail(id),
    queryFn: () => membershipsApi.getMembershipById(id),
    enabled: !!id,
  });
};

export const useCreateMembership = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateMembershipPayload) => membershipsApi.createMembership(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERSHIP_KEYS.lists() });
      toast({
        title: 'Success',
        description: 'Membership assigned successfully',
        variant: 'success',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to assign membership',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateMembership = (id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: Partial<CreateMembershipPayload>) =>
      membershipsApi.updateMembership(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERSHIP_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: MEMBERSHIP_KEYS.lists() });
      toast({
        title: 'Success',
        description: 'Membership updated successfully',
        variant: 'success',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to update membership',
        variant: 'destructive',
      });
    },
  });
};

export const useRenewMembership = (id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: { planId: string; startDate: string; endDate: string }) =>
      membershipsApi.renewMembership(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERSHIP_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: MEMBERSHIP_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      toast({
        title: 'Success',
        description: 'Membership renewed successfully',
        variant: 'success',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to renew membership',
        variant: 'destructive',
      });
    },
  });
};
