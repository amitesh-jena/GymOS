import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, CreditCard, Dumbbell, Clock, Info } from 'lucide-react';
import { LoadingState } from '@/components/ux/LoadingState';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../hooks/useNotifications';
import { AppNotification } from '../types';

export const NotificationInbox = () => {
  const navigate = useNavigate();
  const { data: notificationsData, isLoading, isError, refetch } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  if (isLoading) return <LoadingState />;
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-destructive font-semibold mb-2">Failed to load notifications</p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  const notifications = notificationsData?.results || [];

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
    if (notification.targetUrl) {
      navigate(notification.targetUrl);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'MEMBERSHIP_EXPIRING':
      case 'MEMBERSHIP_EXPIRED':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'PAYMENT_DUE':
        return <CreditCard className="h-5 w-5 text-red-500" />;
      case 'WORKOUT_AVAILABLE':
      case 'WORKOUT_ASSIGNED':
        return <Dumbbell className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your recent alerts and updates.
          </p>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasUnread || markAllAsRead.isPending}
            onClick={() => markAllAsRead.mutate()}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/20 pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Inbox
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-foreground">No notifications yet</p>
              <p className="text-sm">You are all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-4 p-4 sm:p-6 hover:bg-muted/50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-secondary/20' : ''}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleNotificationClick(notification);
                    }
                  }}
                  aria-label={`${notification.isRead ? 'Read' : 'Unread'} notification: ${notification.title}`}
                >
                  <div className="shrink-0 mt-1">{getIconForType(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold overflow-hidden text-ellipsis whitespace-nowrap ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                          {notification.title}
                        </span>
                        {!notification.isRead && (
                          <Badge
                            variant="default"
                            className="text-[10px] h-4 px-1.5 shrink-0 bg-blue-600"
                          >
                            New
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                        {new Date(notification.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p
                      className={`text-sm break-words ${!notification.isRead ? 'text-muted-foreground font-medium' : 'text-muted-foreground'}`}
                    >
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
