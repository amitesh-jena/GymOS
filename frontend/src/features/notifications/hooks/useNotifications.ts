import { isAxiosError } from 'axios';
import { ApiError } from '@/types/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications.api';
import { useToast } from '@/components/ui/use-toast';

export const NOTIFICATIONS_KEYS = {
  all: ['notifications'] as const,
  lists: () => [...NOTIFICATIONS_KEYS.all, 'list'] as const,
  list: (filters: string) => [...NOTIFICATIONS_KEYS.lists(), { filters }] as const,
  unreadCount: () => [...NOTIFICATIONS_KEYS.all, 'unreadCount'] as const,
};

export const useNotifications = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: NOTIFICATIONS_KEYS.list(JSON.stringify(params || {})),
    queryFn: () => notificationsApi.getNotifications(params),
    refetchInterval: 60000, // Sync every 60s
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: NOTIFICATIONS_KEYS.unreadCount(),
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: 60000,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.all });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to mark notification as read',
        variant: 'destructive',
      });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.all });
      toast({ title: 'Success', description: 'All notifications marked as read' });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to mark all as read',
        variant: 'destructive',
      });
    },
  });
};
