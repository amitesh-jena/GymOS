import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUnreadCount } from '../hooks/useNotifications';

export const NotificationBell = () => {
  const navigate = useNavigate();
  const { data: unreadCount, isLoading } = useUnreadCount();

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative shrink-0"
      aria-label={
        unreadCount && unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'
      }
      onClick={handleNotificationClick}
    >
      <Bell className="h-5 w-5 text-muted-foreground" />

      {!isLoading && unreadCount !== undefined && unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Button>
  );
};
