export interface AnalyticsOverview {
  totalMembers: number;
  activeMemberships: number;
  monthlyRevenue: number;
  upcomingRenewals: number;
  attendanceRate: number; // percentage
  memberGrowth: number; // percentage vs last month
}

export interface RevenueDataPoint {
  date: string; // ISO date string or formatted (e.g. MMM DD)
  amount: number;
}

export interface RevenueAnalytics {
  trend: RevenueDataPoint[];
  totalExpected: number;
  totalCollected: number;
  outstanding: number;
}

export interface AttendanceDataPoint {
  date: string;
  count: number;
}

export interface AttendanceAnalytics {
  trend: AttendanceDataPoint[];
  weeklyAverage: number;
}

export interface MembershipDistribution {
  planName: string;
  count: number;
}

export interface MembershipAnalytics {
  distribution: MembershipDistribution[];
  expiringIn30Days: number;
  recentlyExpired: number;
}

export type DateRangeFilter = '7_DAYS' | '30_DAYS' | '90_DAYS' | 'THIS_YEAR';
