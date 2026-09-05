import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCurrentSubscription,
  getAvailablePlans,
  cancelSubscription,
  changePlan,
} from '../api/saas.api';

export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: ['saas-subscription', 'current'],
    queryFn: getCurrentSubscription,
  });
};

export const useAvailablePlans = () => {
  return useQuery({
    queryKey: ['saas-plans'],
    queryFn: getAvailablePlans,
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saas-subscription', 'current'] });
    },
  });
};

export const useChangePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => changePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saas-subscription', 'current'] });
    },
  });
};
