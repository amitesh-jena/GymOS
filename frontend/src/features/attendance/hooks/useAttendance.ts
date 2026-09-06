import { isAxiosError } from 'axios';
import { ApiError } from '@/types/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance.api';
import { CheckInPayload } from '../types';
import { useToast } from '@/components/ui/use-toast';

const ATTENDANCE_KEYS = {
  all: ['attendance'] as const,
  lists: () => [...ATTENDANCE_KEYS.all, 'list'] as const,
  list: (filters: string) => [...ATTENDANCE_KEYS.lists(), { filters }] as const,
};

export const useAttendance = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ATTENDANCE_KEYS.list(JSON.stringify(params || {})),
    queryFn: () => attendanceApi.getAttendance(params),
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CheckInPayload) => attendanceApi.checkIn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast({
        title: 'Checked In',
        description: 'Member check-in successful.',
        variant: 'success',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description:
          (isAxiosError<ApiError>(error) ? error.response?.data?.error?.message : undefined) ||
          'Failed to check-in member',
        variant: 'destructive',
      });
    },
  });
};
