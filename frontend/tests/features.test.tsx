import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';

import { MembersList } from '@/features/members/components/MembersList';
import { TrainersList } from '@/features/trainers/components/TrainersList';
import { PlansList } from '@/features/plans/components/PlansList';
import { MembershipsList } from '@/features/memberships/components/MembershipsList';
import { AttendanceList } from '@/features/attendance/components/AttendanceList';
import { NotFoundScreen, ForbiddenScreen } from '@/features/system/SystemScreens';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter>
          {ui}
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Mock the hooks deeply so MSW is not triggered and components render fully
jest.mock('@/features/members/hooks/useMembers', () => ({
  useMembers: () => ({ data: { results: [{ id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '123', status: 'ACTIVE', joinedDate: '2023-01-01' }] }, isLoading: false }),
}));

jest.mock('@/features/trainers/hooks/useTrainers', () => ({
  useTrainers: () => ({ data: { results: [{ id: '1', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '123', status: 'ACTIVE', specialization: 'Yoga' }] }, isLoading: false }),
}));

jest.mock('@/features/plans/hooks/usePlans', () => ({
  usePlans: () => ({ data: { results: [{ id: '1', name: 'Basic Plan', type: 'MONTHLY', price: '49.99', durationDays: 30, status: 'OPEN' }] }, isLoading: false }),
}));

jest.mock('@/features/memberships/hooks/useMemberships', () => ({
  useMemberships: () => ({ data: { results: [{ id: '1', memberId: '1', planId: '1', startDate: '2023-01-01', endDate: '2024-01-01', status: 'ACTIVE', memberName: 'John', planName: 'Basic' }] }, isLoading: false }),
}));

jest.mock('@/features/attendance/hooks/useAttendance', () => ({
  useAttendance: () => ({ data: { results: [{ id: '1', memberId: '1', checkInTime: '2023-01-01T10:00:00Z', notes: 'Late', memberName: 'John Doe' }] }, isLoading: false }),
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() })
}));

describe('Features Components Integration', () => {
  it('renders list components', () => {
    let view = renderWithProviders(<MembersList />);
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    view.unmount();

    view = renderWithProviders(<TrainersList />);
    expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
    view.unmount();

    view = renderWithProviders(<PlansList />);
    expect(screen.getByText(/Basic Plan/)).toBeInTheDocument();
    view.unmount();

    view = renderWithProviders(<MembershipsList />);
    expect(screen.getByText(/Memberships/)).toBeInTheDocument();
    view.unmount();

    view = renderWithProviders(<AttendanceList />);
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  it('renders system components', () => {
    let view = renderWithProviders(<NotFoundScreen />);
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    view.unmount();

    view = renderWithProviders(<ForbiddenScreen />);
    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
  });
});
