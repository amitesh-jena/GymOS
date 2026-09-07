import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from '../src/features/notifications/hooks/useNotifications';
import { ToastProvider } from '@/components/ui/toast';

jest.mock('../src/features/notifications/api/notifications.api', () => ({
  notificationsApi: {
    getNotifications: jest.fn().mockResolvedValue({ results: [], count: 0 }),
    getUnreadCount: jest.fn().mockResolvedValue(0),
    markAsRead: jest.fn().mockResolvedValue({ id: '1' }),
    markAllAsRead: jest.fn().mockResolvedValue(true),
  }
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}><ToastProvider>{children}</ToastProvider></QueryClientProvider>
);

describe('useNotifications hooks', () => {
  it('useNotifications fetches data', async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('useUnreadCount fetches data', async () => {
    const { result } = renderHook(() => useUnreadCount(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('useMarkAsRead mutates data', async () => {
    const { result } = renderHook(() => useMarkAsRead(), { wrapper });
    act(() => {
      result.current.mutate('1');
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('useMarkAllAsRead mutates data', async () => {
    const { result } = renderHook(() => useMarkAllAsRead(), { wrapper });
    act(() => {
      result.current.mutate();
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
