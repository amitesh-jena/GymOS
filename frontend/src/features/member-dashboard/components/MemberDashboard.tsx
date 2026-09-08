import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Activity, Dumbbell, CalendarCheck, FileText, Apple, CreditCard } from 'lucide-react';
import { useMemberships } from '@/features/memberships/hooks/useMemberships';
import { usePayments } from '@/features/payments/hooks/usePayments';
import { useMemberWorkouts } from '@/features/workouts/hooks/useWorkouts';
import { Badge } from '@/components/ui/badge';

export const MemberDashboard: React.FC = () => {
  const { data: memberData } = useMemberships();
  const { data: paymentsData } = usePayments(1);
  const { data: workoutsData } = useMemberWorkouts(1);

  const activeMembership = memberData?.results?.find((m) => m.status === 'ACTIVE');
  const pendingWorkouts = workoutsData?.results?.filter((w) => w.status === 'PENDING') || [];
  const latestPayment = paymentsData?.results?.[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome Back!</h2>
        <p className="text-muted-foreground mt-1">
          Here is a summary of your current gym activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Membership Summary */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Active Membership</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {activeMembership ? (
              <div className="space-y-1">
                <div className="text-2xl font-bold">Active</div>
                <p className="text-xs text-muted-foreground">
                  Expires {new Date(activeMembership.endDate).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold text-muted-foreground">None</div>
                <p className="text-xs text-muted-foreground">No active membership</p>
              </div>
            )}
          </CardContent>
          <div className="mt-auto p-4 pt-0">
            <Link to="/member/membership">
              <Button variant="outline" className="w-full text-xs" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </Card>

        {/* Workouts Summary */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Pending Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingWorkouts.length}</div>
            <p className="text-xs text-muted-foreground">Workouts await your completion</p>
          </CardContent>
          <div className="mt-auto p-4 pt-0">
            <Link to="/member/workouts">
              <Button variant="outline" className="w-full text-xs" size="sm">
                Go to Workouts
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Payment */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Latest Payment</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {latestPayment ? (
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: latestPayment.currency || 'USD',
                  }).format(Number(latestPayment.amount))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Paid on {new Date(latestPayment.paymentDate).toLocaleDateString()}{' '}
                  <Badge variant="outline" className="ml-1 text-[10px] uppercase">
                    {latestPayment.status}
                  </Badge>
                </p>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">No recent payments</div>
            )}
          </CardContent>
          <div className="mt-auto p-4 pt-0">
            <Link to="/member/payments">
              <Button variant="outline" className="w-full text-xs" size="sm">
                View History
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/member/attendance">
          <Button
            variant="secondary"
            className="h-24 w-full flex flex-col items-center justify-center gap-2"
          >
            <CalendarCheck className="h-6 w-6" />
            <span>Attendance History</span>
          </Button>
        </Link>
        <Link to="/member/diet">
          <Button
            variant="secondary"
            className="h-24 w-full flex flex-col items-center justify-center gap-2"
          >
            <Apple className="h-6 w-6" />
            <span>My Diet Plan</span>
          </Button>
        </Link>
        <Link to="/member/progress">
          <Button
            variant="secondary"
            className="h-24 w-full flex flex-col items-center justify-center gap-2"
          >
            <Activity className="h-6 w-6" />
            <span>Track Progress</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
