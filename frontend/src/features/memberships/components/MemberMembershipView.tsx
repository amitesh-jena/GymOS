import React from 'react';
import { useMemberships } from '../hooks/useMemberships';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const MemberMembershipView: React.FC = () => {
  const { data, isLoading, error, refetch } = useMemberships();

  if (isLoading) return <LoadingState text="Loading your membership details..." />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  const memberships = data?.results || [];
  const active = memberships.find((m) => m.status === 'ACTIVE') || memberships[0];

  if (!active)
    return (
      <EmptyState title="No Membership" description="You do not have any membership records." />
    );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Subscription</h2>
        <p className="text-muted-foreground mt-1">Review your current gym access plan.</p>
      </div>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <CardTitle className="text-2xl">Membership Plan</CardTitle>
              <div className="text-muted-foreground mt-1 text-sm font-mono">{active.id}</div>
            </div>
            <Badge
              variant={
                active.status === 'ACTIVE'
                  ? 'default'
                  : active.status === 'EXPIRED'
                    ? 'destructive'
                    : 'secondary'
              }
              className="text-sm py-1"
            >
              {active.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Start Date</p>
              <p className="font-medium">{new Date(active.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">End Date</p>
              <p className="font-medium">{new Date(active.endDate).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {active.status !== 'ACTIVE' && (
        <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
          <p className="text-sm">
            Your membership is currently inactive. Visit the front desk to renew.
          </p>
        </div>
      )}
    </div>
  );
};
