import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePlans, usePlan, useCreatePlan, useUpdatePlan } from '../src/features/plans/hooks/usePlans';
import { ToastProvider } from '@/components/ui/toast';
import { plansApi } from '../src/features/plans/api/plans.api';

jest.mock('../src/features/plans/api/plans.api', () => ({
  plansApi: {
    getPlans: jest.fn().mockResolvedValue({ results: [], count: 0 }),
    getPlanById: jest.fn().mockResolvedValue({ id: '1' }),
    createPlan: jest.fn().mockResolvedValue({ id: '2' }),
    updatePlan: jest.fn().mockResolvedValue({ id: '1' }),
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

describe('usePlans hooks', () => {
  it('usePlans fetches data', async () => {
    const { result } = renderHook(() => usePlans(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('usePlan fetches data', async () => {
    const { result } = renderHook(() => usePlan('1'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('useCreatePlan mutates data', async () => {
    const { result } = renderHook(() => useCreatePlan(), { wrapper });
    act(() => {
      result.current.mutate({ name: 'Pro', amount: 100, interval: 'MONTH' });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('useUpdatePlan mutates data', async () => {
    const { result } = renderHook(() => useUpdatePlan(), { wrapper });
    act(() => {
      result.current.mutate({ id: '1', payload: { name: 'Super Pro' } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
