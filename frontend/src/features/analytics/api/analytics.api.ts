import api from '@/services/api';
import type { ApiResponse } from '@/types/api';
import {
  DateRangeFilter,
  AnalyticsOverview,
  RevenueAnalytics,
  AttendanceAnalytics,
  MembershipAnalytics,
} from '../types';

export const getAnalyticsOverview = async (range: DateRangeFilter) => {
  const { data } = await api.get<ApiResponse<AnalyticsOverview>>('/analytics/overview', {
    params: { range },
  });
  return data.data;
};

export const getRevenueAnalytics = async (range: DateRangeFilter) => {
  const { data } = await api.get<ApiResponse<RevenueAnalytics>>('/analytics/revenue', {
    params: { range },
  });
  return data.data;
};

export const getAttendanceAnalytics = async (range: DateRangeFilter) => {
  const { data } = await api.get<ApiResponse<AttendanceAnalytics>>('/analytics/attendance', {
    params: { range },
  });
  return data.data;
};

export const getMembershipAnalytics = async (range: DateRangeFilter) => {
  const { data } = await api.get<ApiResponse<MembershipAnalytics>>('/analytics/memberships', {
    params: { range },
  });
  return data.data;
};
