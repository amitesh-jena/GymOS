import React, { useState } from 'react';
import { DateRangeFilter } from '../types';
import {
  useAnalyticsOverview,
  useRevenueAnalytics,
  useMembershipAnalytics,
} from '../hooks/useAnalytics';
import { KPICard } from './KPICard';
import { RevenueChart } from './RevenueChart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const PLAN_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted-foreground))',
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export const AnalyticsDashboard: React.FC = () => {
  const [range, setRange] = useState<DateRangeFilter>('30_DAYS');

  const {
    data: overview,
    isLoading: overviewLoading,
    isError: overviewError,
  } = useAnalyticsOverview(range);
  const {
    data: revenue,
    isLoading: revenueLoading,
    isError: revenueError,
  } = useRevenueAnalytics(range);
  const {
    data: memberships,
    isLoading: memLoading,
    isError: memError,
  } = useMembershipAnalytics(range);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Analytics & Reporting</h2>
          <p className="text-muted-foreground mt-1">
            Monitor key performance indicators and business growth.
          </p>
        </div>
        <div className="w-[180px]">
          <Select value={range} onValueChange={(val) => setRange(val as DateRangeFilter)}>
            <SelectTrigger>
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7_DAYS">Last 7 Days</SelectItem>
              <SelectItem value="30_DAYS">Last 30 Days</SelectItem>
              <SelectItem value="90_DAYS">Last 90 Days</SelectItem>
              <SelectItem value="THIS_YEAR">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Members"
          value={overview?.totalMembers ?? 0}
          trend={overview?.memberGrowth}
          subtitle="vs previous period"
          loading={overviewLoading}
          error={overviewError}
        />
        <KPICard
          title="Active Memberships"
          value={overview?.activeMemberships ?? 0}
          subtitle="Currently active"
          loading={overviewLoading}
          error={overviewError}
        />
        <KPICard
          title="Period Revenue"
          value={overview ? formatCurrency(overview.monthlyRevenue) : '$0.00'}
          subtitle="Total collected"
          loading={overviewLoading}
          error={overviewError}
        />
        <KPICard
          title="Upcoming Renewals"
          value={overview?.upcomingRenewals ?? 0}
          subtitle="Expiring next 30 days"
          loading={overviewLoading}
          error={overviewError}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart data={revenue} isLoading={revenueLoading} isError={revenueError} />

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {memLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : memError || !memberships ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-destructive">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p>Unable to load memberships</p>
              </div>
            ) : memberships.distribution.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                <p>No active plans</p>
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={memberships.distribution}
                      dataKey="count"
                      nameKey="planName"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      label
                    >
                      {memberships.distribution.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PLAN_COLORS[index % PLAN_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
