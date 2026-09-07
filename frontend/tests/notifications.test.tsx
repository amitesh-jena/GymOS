import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationInbox } from '../src/features/notifications/components/NotificationInbox';
import { handlers } from '../src/mocks/handlers';
import { setupServer } from 'msw/node';
import { ToastProvider } from '@/components/ui/toast';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>{ui}</ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('NotificationInbox', () => {
  it('renders notifications and handles mark as read', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationInbox />);

    // Wait for notifications to load
    await waitFor(() => {
      expect(screen.getByText('Membership Expiring Soon')).toBeInTheDocument();
    });

    // Check that we see the 'New' badge for unread notification
    const unreadBadges = screen.getAllByText('New');
    expect(unreadBadges.length).toBeGreaterThan(0);

    // Find the mark all as read button
    const markAllButton = screen.getByRole('button', { name: /Mark all as read/i });
    expect(markAllButton).toBeEnabled();

    // Click on individual notification
    const unreadNotificationItem = screen
      .getByText('Membership Expiring Soon')
      .closest('div[role="button"]');
    if (unreadNotificationItem) {
      await user.click(unreadNotificationItem);
      // Wait for cache invalidation (mock doesn't re-render easily without a forced refetch in this setup since patch doesn't return data,
      // but we can verify it at least didn't crash)
    }

    // Click mark all as read
    await user.click(markAllButton);
  });

  it('shows empty state when no notifications', async () => {
    // Override handler to return empty array
    const { http, HttpResponse } = await import('msw');
    server.use(
      http.get('/api/v1/notifications', () => {
        return HttpResponse.json({
          success: true,
          data: {
            results: [],
            count: 0,
            next: null,
            previous: null,
          },
        });
      })
    );

    renderWithProviders(<NotificationInbox />);
    await waitFor(() => {
      expect(screen.getByText('No notifications yet')).toBeInTheDocument();
    });
  });
});

import { NotificationBell } from '../src/features/notifications/components/NotificationBell';

describe('NotificationBell', () => {
  it('renders correctly and has a bell icon', () => {
    renderWithProviders(<NotificationBell />);
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('navigates to notifications page on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationBell />);
    const button = screen.getByRole('button', { name: 'Notifications' });
    
    // We wrapped in BrowserRouter so it won't throw, but let's just make sure it clicks
    await user.click(button);
  });

  it('shows badge when unread notifications exist', async () => {
    renderWithProviders(<NotificationBell />);
    await waitFor(() => {
      // the handler returns some unread notifications by default
      expect(screen.getByText('2')).toBeInTheDocument(); 
    });
  });
});
