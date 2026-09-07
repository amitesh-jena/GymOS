import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemberships, useMembership, useCreateMembership, useRenewMembership } from '../src/features/memberships/hooks/useMemberships';
import { ToastProvider } from '@/components/ui/toast';
import { membershipsApi } from '../src/features/memberships/api/memberships.api';

jest.mock('../src/features/memberships/api/memberships.api', () => ({
  membershipsApi: {
    getMemberships: jest.fn().mockResolvedValue({ results: [], count: 0 }),
    getMembershipById: jest.fn().mockResolvedValue({ id: '1' }),
    createMembership: jest.fn().mockResolvedValue({ id: '2' }),
    updateMembership: jest.fn().mockResolvedValue({ id: '1' }),
    renewMembership: jest.fn().mockResolvedValue({ id: '1' }),
  }
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } }
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ToastProvider>{children}</ToastProvider>
  </QueryClientProvider>
);

describe('useMemberships hooks', () => {
  it('useMemberships fetches data', async () => {
    const { result } = renderHook(() => useMemberships(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.results).toEqual([]);
  });

  it('useMembership fetches data', async () => {
    const { result } = renderHook(() => useMembership('1'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe('1');
  });

  it('useCreateMembership mutates data', async () => {
    const { result } = renderHook(() => useCreateMembership(), { wrapper });
    act(() => {
      result.current.mutate({ memberId: '1', planId: '1', startDate: '2026' });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(membershipsApi.createMembership).toHaveBeenCalled();
  });

  it('useRenewMembership mutates data', async () => {
    const { result } = renderHook(() => useRenewMembership(), { wrapper });
    act(() => {
      result.current.mutate({ id: '1', planId: '1', startDate: '2026', endDate: '2027' });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(membershipsApi.renewMembership).toHaveBeenCalled();
  });
});
