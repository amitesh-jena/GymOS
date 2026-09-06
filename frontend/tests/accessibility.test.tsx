import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemberForm } from '@/features/members/components/MemberForm';
import { server } from './server';
import { http, HttpResponse } from 'msw';

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('Accessibility & UX Audit Verification', () => {
  beforeEach(() => {
    // Reset MSW handlers that might interfere
    server.use(
      http.post('*/api/v1/members', () => {
        return HttpResponse.json({}, { status: 400 }); // mock failure to keep validation states open
      })
    );
  });

  it('provides aria-invalid associations on form validation errors', async () => {
    render(<MemberForm />, { wrapper });

    // The submit button
    const submitBtn = screen.getByRole('button', { name: /Save Member/i });
    
    // Submit empty form to trigger validation
    fireEvent.click(submitBtn);

    // After validation fails, standard inputs should gain aria-invalid
    await waitFor(() => {
      // First Name input
      const firstNameInput = screen.getByLabelText(/First Name/i);
      expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
      const firstNameErrorId = firstNameInput.getAttribute('aria-describedby');
      expect(firstNameErrorId).toBeTruthy();
      
      const firstNameErrorEl = document.getElementById(firstNameErrorId!);
      expect(firstNameErrorEl).toBeInTheDocument();
      expect(firstNameErrorEl?.textContent).toBeTruthy();
      
      // Last Name input
      const lastNameInput = screen.getByLabelText(/Last Name/i);
      expect(lastNameInput).toHaveAttribute('aria-invalid', 'true');
      const lastNameErrorId = lastNameInput.getAttribute('aria-describedby');
      expect(lastNameErrorId).toBeTruthy();
      
      const lastNameErrorEl = document.getElementById(lastNameErrorId!);
      expect(lastNameErrorEl).toBeInTheDocument();
      expect(lastNameErrorEl?.textContent).toBeTruthy();
    });
  });

});
