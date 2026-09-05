import { http, HttpResponse, delay } from 'msw';
import {
  AnalyticsOverview,
  RevenueAnalytics,
  AttendanceAnalytics,
  MembershipAnalytics,
} from '../../features/analytics/types';

const MOCK_OVERVIEW: AnalyticsOverview = {
  totalMembers: 405,
  activeMemberships: 382,
  monthlyRevenue: 28540.0,
  upcomingRenewals: 42,
  attendanceRate: 78.4,
  memberGrowth: 5.2,
};

const MOCK_REVENUE: RevenueAnalytics = {
  trend: [
    { date: '2026-08-01', amount: 1540 },
    { date: '2026-08-08', amount: 2100 },
    { date: '2026-08-15', amount: 1800 },
    { date: '2026-08-22', amount: 3200 },
    { date: '2026-08-29', amount: 2750 },
    { date: '2026-09-05', amount: 4100 },
  ],
  totalExpected: 35000,
  totalCollected: 28540,
  outstanding: 6460,
};

const MOCK_MEMBERSHIPS: MembershipAnalytics = {
  distribution: [
    { planName: 'Starter', count: 120 },
    { planName: 'Professional', count: 210 },
    { planName: 'Enterprise', count: 52 },
  ],
  expiringIn30Days: 42,
  recentlyExpired: 18,
};

const MOCK_ATTENDANCE: AttendanceAnalytics = {
  trend: [
    { date: '2026-09-01', count: 124 },
    { date: '2026-09-02', count: 156 },
    { date: '2026-09-03', count: 189 },
    { date: '2026-09-04', count: 142 },
    { date: '2026-09-05', count: 98 },
  ],
  weeklyAverage: 141.8,
};

export const analyticsHandlers = [
  http.get('/api/v1/analytics/overview', async () => {
    await delay(300);
    return HttpResponse.json({ success: true, data: MOCK_OVERVIEW });
  }),

  http.get('/api/v1/analytics/revenue', async () => {
    await delay(300);
    return HttpResponse.json({ success: true, data: MOCK_REVENUE });
  }),

  http.get('/api/v1/analytics/memberships', async () => {
    await delay(300);
    return HttpResponse.json({ success: true, data: MOCK_MEMBERSHIPS });
  }),

  http.get('/api/v1/analytics/attendance', async () => {
    await delay(300);
    return HttpResponse.json({ success: true, data: MOCK_ATTENDANCE });
  }),
];
