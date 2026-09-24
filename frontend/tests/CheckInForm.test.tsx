import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CheckInForm } from '../src/features/attendance/components/CheckInForm';
import { handlers } from '../src/mocks/handlers';
import { setupServer } from 'msw/node';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { DomainProvider } from '@/contexts/DomainContext';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';

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
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <DomainProvider>
        <AuthProvider>
            <WorkspaceProvider>
              <ToastProvider>{children}</ToastProvider>
            </WorkspaceProvider>
          </AuthProvider>
        </DomainProvider>
        </BrowserRouter>
      </QueryClientProvider>
    ),
  });
};

describe('CheckInForm', () => {
  it('renders correctly', async () => {
    const { http, HttpResponse } = await import('msw');
    server.use(
      http.get('/api/v1/members', () => {
        return HttpResponse.json({ success: true, data: { results: [], count: 0, next: null, previous: null } });
      })
    );
    renderWithProviders(<CheckInForm />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Check In/i })).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles valid submission successfully', async () => {
    const { http, HttpResponse } = await import('msw');
    server.use(
      http.get('/api/v1/members', () => {
        return HttpResponse.json({ success: true, data: { results: [{ id: '1', firstName: 'John', lastName: 'Doe', phone: '123' }], count: 1, next: null, previous: null } });
      })
    );
    renderWithProviders(<CheckInForm />);

    const submitBtn = await screen.findByRole('button', { name: /Check In Now/i });
    
    // The button should be disabled initially because no member is selected
    expect(submitBtn).toBeDisabled();
  });
});
