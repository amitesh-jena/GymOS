import api from '@/services/api';
import type { ApiResponse } from '@/types/api';
import { SaaSSubscription, SaaSPlan } from '../types';
import { adaptMajorToMinor } from '@/utils/currency';

const adaptSaaSPlan = (p: SaaSPlan): SaaSPlan => ({
  ...p,
  priceMinorUnits: adaptMajorToMinor(p.price, p.currency)
});

const adaptSub = (s: SaaSSubscription): SaaSSubscription => {
  if (s.plan) {
    return { ...s, plan: adaptSaaSPlan(s.plan) };
  }
  return s;
};

export const getCurrentSubscription = async (tenantId: string) => {
  const { data } = await api.get<ApiResponse<SaaSSubscription>>(`/subscriptions/current?tenantId=${tenantId}`);
  return adaptSub(data.data);
};

export const getAvailablePlans = async () => {
  const { data } = await api.get<ApiResponse<SaaSPlan[]>>('/subscriptions/plans');
  return data.data.map(adaptSaaSPlan);
};

export const cancelSubscription = async (tenantId: string) => {
  const { data } = await api.post<ApiResponse<SaaSSubscription>>('/subscriptions/current/cancel', {
    tenantId,
  });
  return adaptSub(data.data);
};

export const changePlan = async (planId: string, tenantId: string) => {
  const { data } = await api.post<ApiResponse<SaaSSubscription>>('/subscriptions/current/change', {
    planId,
    tenantId,
  });
  return adaptSub(data.data);
};
