import React from 'react';
import { RevenueAnalytics } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { AlertCircle } from 'lucide-react';

interface RevenueChartProps {
  data?: RevenueAnalytics;
  isLoading: boolean;
  isError: boolean;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, isLoading, isError }) => {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : isError || !data ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-destructive">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p>Unable to load revenue trend</p>
          </div>
        ) : data.trend.length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <p>No revenue data for this period</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  formatter={(val: unknown) => [`$${Number(val).toFixed(2)}`, 'Revenue']}
                  labelFormatter={(lbl) => `Date: ${lbl}`}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
