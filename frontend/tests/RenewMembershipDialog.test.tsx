import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenewMembershipDialog } from '../src/features/memberships/components/RenewMembershipDialog';
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
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>{ui}</ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
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
    renderWithProviders(<RenewMembershipDialog membership={mockMembership} onRenew={() => {}} />);
    
    // Open Dialog
    const triggerBtn = screen.getByRole('button', { name: /Renew/i });
    await user.click(triggerBtn);
    
    // Inside dialog
    const renewSubmitBtn = screen.getByRole('button', { name: /Confirm Renewal/i });
    expect(renewSubmitBtn).toBeInTheDocument();

    await user.click(renewSubmitBtn);

    // Expect loading state transition
    expect(renewSubmitBtn).toBeDisabled();
    await waitFor(() => {
      // dialog closes after submission succeeds
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
