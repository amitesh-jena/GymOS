import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMemberWorkouts, completeWorkout } from '../api/workouts.api';
import { useToast } from '@/components/ui/use-toast';
import { isAxiosError } from 'axios';
import { ApiError } from '@/types/api';

export const useMemberWorkouts = (page = 1) => {
  return useQuery({
    queryKey: ['member-workouts', page],
    queryFn: () => getMemberWorkouts(page),
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
