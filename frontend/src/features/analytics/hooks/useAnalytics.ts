import { useQuery } from '@tanstack/react-query';
import { DateRangeFilter } from '../types';
import {
  getAnalyticsOverview,
  getRevenueAnalytics,
  getAttendanceAnalytics,
  getMembershipAnalytics,
} from '../api/analytics.api';

export const useAnalyticsOverview = (range: DateRangeFilter) => {
  return useQuery({
    queryKey: ['analytics', 'overview', range],
    queryFn: () => getAnalyticsOverview(range),
  });
};

export const useRevenueAnalytics = (range: DateRangeFilter) => {
  return useQuery({
    queryKey: ['analytics', 'revenue', range],
    queryFn: () => getRevenueAnalytics(range),
  });
};

export const useAttendanceAnalytics = (range: DateRangeFilter) => {
  return useQuery({
    queryKey: ['analytics', 'attendance', range],
    queryFn: () => getAttendanceAnalytics(range),
  });
};

export const useMembershipAnalytics = (range: DateRangeFilter) => {
  return useQuery({
    queryKey: ['analytics', 'memberships', range],
    queryFn: () => getMembershipAnalytics(range),
  });
};
