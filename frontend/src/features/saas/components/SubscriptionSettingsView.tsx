import React from 'react';
import { useCurrentSubscription, useAvailablePlans, useCancelSubscription } from '../hooks/useSaaS';
import { SaaSPlanCard } from './SaaSPlanCard';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const SubscriptionSettingsView: React.FC = () => {
  const { data: sub, isLoading: subLoading, error: subError } = useCurrentSubscription();
  const { data: plans, isLoading: plansLoading } = useAvailablePlans();
  const cancelMutation = useCancelSubscription();
  const { toast } = useToast();

  if (subLoading || plansLoading) return <LoadingState text="Loading subscription details..." />;
  if (subError || !sub) return <ErrorState />;

  const handleCancel = () => {
    cancelMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: 'Subscription Cancelled',
          description: 'Your subscription will terminate at the end of the current billing cycle.',
        });
      },
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">SaaS Subscription</h2>
        <p className="text-muted-foreground mt-1">Manage your GymOS plan and billing.</p>
      </div>

      {sub.status === 'CANCELLED' && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start gap-4">
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold">Subscription Cancelled</h4>
            <p className="text-sm mt-1">
              Your subscription is set to cancel at the end of the billing cycle on{' '}
              {new Date(sub.currentPeriodEnd).toLocaleDateString()}.
            </p>
          </div>
        </div>
      )}
      {sub.status === 'TRIAL' && (
        <div className="bg-primary/10 text-primary p-4 rounded-lg flex items-start gap-4">
          <div>
            <h4 className="font-semibold">Free Trial Active</h4>
            <p className="text-sm mt-1">
              Your trial ends on{' '}
              {sub.trialEnd ? new Date(sub.trialEnd).toLocaleDateString() : 'soon'}. Upgrade to
              retain access.
            </p>
          </div>
        </div>
      )}
      {sub.status === 'GRACE_PERIOD' && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start gap-4">
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold">Payment Failed</h4>
            <p className="text-sm mt-1">
              We could not process your latest payment. Please update your billing method.
            </p>
          </div>
        </div>
      )}

      {/* Current Subscription Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
              <Badge
                variant={
                  sub.status === 'ACTIVE'
                    ? 'default'
                    : sub.status === 'TRIAL'
                      ? 'secondary'
                      : 'destructive'
                }
              >
                {sub.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Active Plan</p>
              <p className="font-semibold">{sub.plan?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Billing Cycle</p>
              <p className="font-medium">
                {sub.plan?.price && sub.plan.price > 0
                  ? `${new Intl.NumberFormat('en-US', { style: 'currency', currency: sub.plan.currency }).format(sub.plan.price)} / ${sub.plan.billingCycle.toLowerCase()}`
                  : 'Free'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Term Ends</p>
              <p className="font-medium">{new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>
            </div>
          </div>

          {sub.status === 'ACTIVE' && !sub.cancelAtPeriodEnd && (
            <div className="mt-8 pt-6 border-t flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Cancel Subscription</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will cancel your subscription at the end of your current billing
                      cycle. You will lose access to all premium features on{' '}
                      {new Date(sub.currentPeriodEnd).toLocaleDateString()}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Confirm Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade / Available Plans */}
      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-4">Available Plans</h3>
        {plans?.length === 0 ? (
          <EmptyState
            title="No plans available"
            description="Contact support for enterprise pricing."
          />
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {plans?.map((plan) => (
              <SaaSPlanCard
                key={plan.id}
                plan={plan}
                isCurrent={sub.planId === plan.id}
                onSelect={(id) => console.log('Upgrade flow not implemented', id)} // Simple stub since true upgrade usually goes to stripe
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
