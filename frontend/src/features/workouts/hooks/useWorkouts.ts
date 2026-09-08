import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMemberWorkouts, completeWorkout } from '../api/workouts.api';
import { useToast } from '@/components/ui/use-toast';
import { isAxiosError } from 'axios';
import { ApiError } from '@/types/api';

import api from '@/services/api';

export const useMemberWorkouts = (page = 1) => {
  return useQuery({
    queryKey: ['member-workouts', page],
    queryFn: () => getMemberWorkouts(page),
  });
};

export const useCreateWorkout = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: {
      memberId: string;
      name: string;
      exercises: { name: string; sets: number; reps: number }[];
    }) => {
      return api.post('/workouts', payload).then((r) => r.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-workouts'] });
      toast({ title: 'Success', description: 'Workout assigned successfully!' });
    },
    onError: () =>
      toast({ title: 'Error', description: 'Failed to assign workout', variant: 'destructive' }),
  });
};

export const useCompleteWorkout = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: completeWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-workouts'] });
      toast({ title: 'Success', description: 'Workout marked as complete!' });
    },
    onError: (error) => {
      let desc = 'An error occurred while completing the workout.';
      if (isAxiosError<ApiError>(error)) desc = error.response?.data?.error?.message || desc;
      toast({ title: 'Error', description: desc, variant: 'destructive' });
    },
  });
};
