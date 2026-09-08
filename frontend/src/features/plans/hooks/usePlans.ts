import { isAxiosError } from 'axios';
import { ApiError } from '@/types/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plansApi } from '../api/plans.api';
import { CreatePlanPayload, UpdatePlanPayload } from '../types';
import { useToast } from '@/components/ui/use-toast';

const PLAN_KEYS = {
  all: ['plans'] as const,
  lists: () => [...PLAN_KEYS.all, 'list'] as const,
  list: (filters: string) => [...PLAN_KEYS.lists(), { filters }] as const,
  details: () => [...PLAN_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PLAN_KEYS.details(), id] as const,
};

export const usePlans = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: PLAN_KEYS.list(JSON.stringify(params || {})),
    queryFn: () => plansApi.getPlans(params),
  });
};

export const usePlan = (id: string) => {
  return useQuery({
    queryKey: PLAN_KEYS.detail(id),
    queryFn: () => plansApi.getPlanById(id),
    enabled: !!id,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreatePlanPayload) => plansApi.createPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLAN_KEYS.lists() });
      toast({ title: 'Success', description: 'Plan created successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to create plan',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdatePlan = (id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdatePlanPayload) => plansApi.updatePlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLAN_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: PLAN_KEYS.lists() });
      toast({ title: 'Success', description: 'Plan updated successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to update plan',
        variant: 'destructive',
      });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => plansApi.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLAN_KEYS.lists() });
      toast({ title: 'Deleted', description: 'Plan has been deleted', variant: 'default' });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to delete plan',
        variant: 'destructive',
      });
    },
  });
};
