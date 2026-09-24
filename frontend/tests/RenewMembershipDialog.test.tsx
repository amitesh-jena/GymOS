import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenewMembershipDialog } from '../src/features/memberships/components/RenewMembershipDialog';
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

// Mock Membership object
const mockMembership = {
  id: '1',
  memberId: '1',
  planId: '1',
  status: 'ACTIVE' as const,
  startDate: '2026-01-01',
  endDate: '2026-12-31',
};

describe('RenewMembershipDialog', () => {
  it('renders and supports renewing membership', async () => {
    const user = userEvent.setup();
    // Render initially closed
    const { rerender } = renderWithProviders(<RenewMembershipDialog membershipId="1" open={false} onOpenChange={() => {}} />);
    
    // Open Dialog
    rerender(<RenewMembershipDialog membershipId="1" open={true} onOpenChange={() => {}} />);
    
    // Inside dialog, we have to wait for plans to load
    const renewSubmitBtn = await screen.findByRole('button', { name: /Confirm Renewal/i });
    expect(renewSubmitBtn).toBeInTheDocument();

    await user.click(renewSubmitBtn);

    // Expect loading state transition
    expect(renewSubmitBtn).toBeDisabled();
  });
});
