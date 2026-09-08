import React from 'react';
import { useMemberProgress } from '../hooks/useProgress';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const MemberProgressView: React.FC = () => {
  const { data, isLoading, error, refetch } = useMemberProgress();

  if (isLoading) return <LoadingState text="Loading progress data..." />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  const records = data?.results || [];
  const chartData = [...records].reverse().map((r) => ({
    date: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: r.weight,
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Progress</h2>
        <p className="text-muted-foreground mt-1">Track your fitness journey over time.</p>
      </div>

      {records.length === 0 ? (
        <EmptyState
          title="No records found"
          description="We haven't tracked any progress metrics yet."
        />
      ) : (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weight Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records.slice(0, 5).map((r) => (
                  <div
                    key={r.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <span className="font-medium">{new Date(r.date).toLocaleDateString()}</span>
                    <div className="flex gap-4 items-center">
                      <span className="text-lg">
                        {r.weight} <span className="text-muted-foreground text-sm">lbs</span>
                      </span>
                      {r.bodyFatPercentage && (
                        <span className="text-sm text-muted-foreground">
                          {r.bodyFatPercentage}% BF
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
