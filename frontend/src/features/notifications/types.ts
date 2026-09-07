export type NotificationType =
  | 'MEMBERSHIP_EXPIRING'
  | 'PAYMENT_DUE'
  | 'WORKOUT_AVAILABLE'
  | 'WORKOUT_ASSIGNED'
  | 'MEMBERSHIP_EXPIRED';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  targetUrl: string; // Resolves to frontend navigable routes
}
