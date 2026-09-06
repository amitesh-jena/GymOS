import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import { MemberDashboard } from '@/features/member-dashboard/components/MemberDashboard';
import { MemberMembershipView } from '@/features/memberships/components/MemberMembershipView';
import { MemberPaymentsList } from '@/features/payments/components/MemberPaymentsList';
import { MemberAttendanceList } from '@/features/attendance/components/MemberAttendanceList';
import { MemberWorkoutsList } from '@/features/workouts/components/MemberWorkoutsList';
import { MemberDietView } from '@/features/diets/components/MemberDietView';
import { MemberProgressView } from '@/features/progress/components/MemberProgressView';

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Member Experience Components', () => {
  it('renders Member Dashboard', async () => {
    renderWithProviders(<MemberDashboard />);
    expect(await screen.findByText(/Welcome Back!/i)).toBeInTheDocument();
  });

  it('renders Member Membership View', async () => {
    renderWithProviders(<MemberMembershipView />);
    expect(await screen.findByText(/My Subscription/i)).toBeInTheDocument();
  });

  it('renders Member Payments List', async () => {
    renderWithProviders(<MemberPaymentsList />);
    expect(await screen.findByText(/Billing History/i)).toBeInTheDocument();
  });

  it('renders Member Attendance List', async () => {
    renderWithProviders(<MemberAttendanceList />);
    expect(await screen.findByText(/Check-in History/i)).toBeInTheDocument();
  });

  it('renders Member Workouts List', async () => {
    renderWithProviders(<MemberWorkoutsList />);
    expect(await screen.findByText(/My Workouts/i)).toBeInTheDocument();
  });

  it('renders Member Diet View', async () => {
    renderWithProviders(<MemberDietView />);
    expect(await screen.findByText(/My Diet Plan/i)).toBeInTheDocument();
  });

  it('renders Member Progress View', async () => {
    renderWithProviders(<MemberProgressView />);
    expect(await screen.findByText(/My Progress/i)).toBeInTheDocument();
  });
});
