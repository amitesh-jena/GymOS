import { isAxiosError } from 'axios';
import { ApiError } from '@/types/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membersApi } from '../api/members.api';
import { CreateMemberPayload, UpdateMemberPayload } from '../types';
import { useToast } from '@/components/ui/use-toast';

const MEMBERS_KEYS = {
  all: ['members'] as const,
  lists: () => [...MEMBERS_KEYS.all, 'list'] as const,
  list: (filters: string) => [...MEMBERS_KEYS.lists(), { filters }] as const,
  details: () => [...MEMBERS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...MEMBERS_KEYS.details(), id] as const,
};

export const useMembers = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: MEMBERS_KEYS.list(JSON.stringify(params || {})),
    queryFn: () => membersApi.getMembers(params),
  });
};

export const useMember = (id: string) => {
  return useQuery({
    queryKey: MEMBERS_KEYS.detail(id),
    queryFn: () => membersApi.getMemberById(id),
    enabled: !!id,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateMemberPayload) => membersApi.createMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEYS.lists() });
      toast({ title: 'Success', description: 'Member created successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to create member',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateMember = (id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateMemberPayload) => membersApi.updateMember(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEYS.lists() });
      toast({ title: 'Success', description: 'Member updated successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to update member',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => membersApi.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEYS.lists() });
      toast({ title: 'Deleted', description: 'Member has been deleted', variant: 'default' });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to delete member',
        variant: 'destructive',
      });
    },
  });
};
