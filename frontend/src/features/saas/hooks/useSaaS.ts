import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCurrentSubscription,
  getAvailablePlans,
  cancelSubscription,
  changePlan,
} from '../api/saas.api';

export const useCurrentSubscription = (tenantId: string | undefined) => {
  return useQuery({
    queryKey: ['saas-subscription', 'current', tenantId],
    queryFn: () => getCurrentSubscription(tenantId as string),
    enabled: !!tenantId,
  });
};

export const useAvailablePlans = () => {
  return useQuery({
    queryKey: ['saas-plans'],
    queryFn: getAvailablePlans,
  });
};

export const useCancelSubscription = (tenantId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelSubscription(tenantId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saas-subscription', 'current', tenantId] });
    },
  });
};

export const useChangePlan = (tenantId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => changePlan(planId, tenantId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saas-subscription', 'current', tenantId] });
    },
  });
};
