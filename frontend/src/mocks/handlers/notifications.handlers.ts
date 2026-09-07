import { http, HttpResponse } from 'msw';
import { AppNotification } from '../../features/notifications/types';
import { PaginatedData } from '../../types/api';

const mockNotifications: AppNotification[] = [
  {
    id: 'n-1',
    type: 'MEMBERSHIP_EXPIRING',
    title: 'Membership Expiring Soon',
    message: 'Your Premium membership will expire in 3 days.',
    isRead: false,
    createdAt: new Date().toISOString(),
    targetUrl: '/member/membership',
  },
  {
    id: 'n-2',
    type: 'PAYMENT_DUE',
    title: 'Payment Overdue',
    message: 'Your payment of $49.99 for this month is overdue.',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    targetUrl: '/member/payments',
  },
  {
    id: 'n-3',
    type: 'WORKOUT_ASSIGNED',
    title: 'New Workout Assigned',
    message: 'Trainer John has assigned you a new Upper Body workout.',
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    targetUrl: '/member/workouts',
  },
  {
    id: 'n-4',
    type: 'WORKOUT_AVAILABLE',
    title: 'Workout Available',
    message: 'Your scheduled workout for today is ready.',
    isRead: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    targetUrl: '/member/workouts',
  },
  {
    id: 'n-5',
    type: 'MEMBERSHIP_EXPIRED',
    title: 'Membership Expired',
    message: 'Your membership has expired. Please renew to continue access.',
    isRead: true,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    targetUrl: '/member/membership',
  },
];

export const notificationsHandlers = [
  http.get('/api/v1/notifications', () => {
    return HttpResponse.json({
      success: true,
      message: 'Notifications retrieved',
      data: {
        results: mockNotifications,
        count: mockNotifications.length,
        next: null,
        previous: null,
      } as PaginatedData<AppNotification>,
    });
  }),

  http.get('/api/v1/notifications/unread-count', () => {
    const count = mockNotifications.filter((n) => !n.isRead).length;
    return HttpResponse.json({
      success: true,
      message: 'Unread count retrieved',
      data: { count },
    });
  }),

  http.post('/api/v1/notifications/:id/read', ({ params }) => {
    const { id } = params;
    const notification = mockNotifications.find((n) => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
    return HttpResponse.json({
      success: true,
      message: 'Notification marked as read',
      data: null,
    });
  }),

  http.post('/api/v1/notifications/read-all', () => {
    mockNotifications.forEach((n) => {
      n.isRead = true;
    });
    return HttpResponse.json({
      success: true,
      message: 'All notifications marked as read',
      data: null,
    });
  }),
];
