import api from '@/services/api';
import type { ApiResponse, PaginatedData } from '@/types/api';
import { AppNotification } from '../types';

export const notificationsApi = {
  getNotifications: async (
    params?: Record<string, string>
  ): Promise<PaginatedData<AppNotification>> => {
    const response = await api.get<ApiResponse<PaginatedData<AppNotification>>>('/notifications', {
      params,
    });
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return response.data.data.count;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.post(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post(`/notifications/read-all`);
  },
};
