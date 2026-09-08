import api from '@/services/api';
import type { ApiResponse } from '@/types/api';
import { SaaSSubscription, SaaSPlan } from '../types';

export const getCurrentSubscription = async () => {
  const { data } = await api.get<ApiResponse<SaaSSubscription>>('/subscriptions/current');
  return data.data;
};

export const getAvailablePlans = async () => {
  const { data } = await api.get<ApiResponse<SaaSPlan[]>>('/subscriptions/plans');
  return data.data;
};

export const cancelSubscription = async () => {
  const { data } = await api.post<ApiResponse<SaaSSubscription>>('/subscriptions/current/cancel');
  return data.data;
};

export const changePlan = async (planId: string) => {
  const { data } = await api.post<ApiResponse<SaaSSubscription>>('/subscriptions/current/change', {
    planId,
  });
  return data.data;
};
