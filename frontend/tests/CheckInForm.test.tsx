import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CheckInForm } from '../src/features/attendance/components/CheckInForm';
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

describe('CheckInForm', () => {
  it('renders correctly', () => {
    renderWithProviders(<CheckInForm />);
    expect(screen.getByRole('button', { name: /Check In/i })).toBeInTheDocument();
  });

  it('handles valid submission successfully', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckInForm />);

    // In a combo box for select member, we click it then click an option
    const combobox = screen.getByRole('combobox', { name: /Select Member/i });
    await user.click(combobox);

    const firstOption = await screen.findByRole('option');
    await user.click(firstOption);

    const submitBtn = screen.getByRole('button', { name: /Check In Now/i });
    await user.click(submitBtn);

    // Expect loading state or success
    expect(submitBtn).toBeDisabled();
    
    // We expect the form to submit because all fields are provided. 
    // Usually a toast will pop up showing success. We wait for it to be enabled again for completion.
    await waitFor(() => {
      expect(submitBtn).toBeEnabled();
    });
  });
});
