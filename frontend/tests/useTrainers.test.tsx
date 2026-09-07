import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTrainers, useTrainer, useCreateTrainer, useUpdateTrainer } from '../src/features/trainers/hooks/useTrainers';
import { ToastProvider } from '@/components/ui/toast';
import { trainersApi } from '../src/features/trainers/api/trainers.api';

jest.mock('../src/features/trainers/api/trainers.api', () => ({
  trainersApi: {
    getTrainers: jest.fn().mockResolvedValue({ results: [], count: 0 }),
    getTrainerById: jest.fn().mockResolvedValue({ id: '1' }),
    createTrainer: jest.fn().mockResolvedValue({ id: '2' }),
    updateTrainer: jest.fn().mockResolvedValue({ id: '1' }),
    deleteTrainer: jest.fn().mockResolvedValue(null),
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

describe('useTrainers hooks', () => {
  it('useTrainers fetches data', async () => {
    const { result } = renderHook(() => useTrainers(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('useTrainer fetches data', async () => {
    const { result } = renderHook(() => useTrainer('1'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('useCreateTrainer mutates data', async () => {
    const { result } = renderHook(() => useCreateTrainer(), { wrapper });
    act(() => {
      result.current.mutate({ userId: '1', specialization: 'Yoga' });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('useUpdateTrainer mutates data', async () => {
    const { result } = renderHook(() => useUpdateTrainer(), { wrapper });
    act(() => {
      result.current.mutate({ id: '1', payload: { specialization: 'Strength' } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
