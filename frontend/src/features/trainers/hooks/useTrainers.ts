import { isAxiosError } from 'axios';
import { ApiError } from '@/types/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainersApi } from '../api/trainers.api';
import { CreateTrainerPayload, UpdateTrainerPayload } from '../types';
import { useToast } from '@/components/ui/use-toast';

const TRAINER_KEYS = {
  all: ['trainers'] as const,
  lists: () => [...TRAINER_KEYS.all, 'list'] as const,
  list: (filters: string) => [...TRAINER_KEYS.lists(), { filters }] as const,
  details: () => [...TRAINER_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TRAINER_KEYS.details(), id] as const,
};

export const useTrainers = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: TRAINER_KEYS.list(JSON.stringify(params || {})),
    queryFn: () => trainersApi.getTrainers(params),
  });
};

export const useTrainer = (id: string) => {
  return useQuery({
    queryKey: TRAINER_KEYS.detail(id),
    queryFn: () => trainersApi.getTrainerById(id),
    enabled: !!id,
  });
};

export const useCreateTrainer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateTrainerPayload) => trainersApi.createTrainer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINER_KEYS.lists() });
      toast({ title: 'Success', description: 'Trainer created successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to create trainer',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTrainer = (id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateTrainerPayload) => trainersApi.updateTrainer(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINER_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: TRAINER_KEYS.lists() });
      toast({ title: 'Success', description: 'Trainer updated successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to update trainer',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTrainer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => trainersApi.deleteTrainer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINER_KEYS.lists() });
      toast({ title: 'Deleted', description: 'Trainer has been deleted', variant: 'default' });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to delete trainer',
        variant: 'destructive',
      });
    },
  });
};
