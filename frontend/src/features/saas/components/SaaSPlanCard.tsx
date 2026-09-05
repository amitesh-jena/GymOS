import React from 'react';
import { SaaSPlan } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface SaaSPlanCardProps {
  plan: SaaSPlan;
  isCurrent?: boolean;
  onSelect?: (planId: string) => void;
  loading?: boolean;
}

export const SaaSPlanCard: React.FC<SaaSPlanCardProps> = ({
  plan,
  isCurrent,
  onSelect,
  loading,
}) => {
  return (
    <Card className={`relative flex flex-col ${isCurrent ? 'border-primary border-2' : ''}`}>
      {isCurrent && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
          <Badge>Current Plan</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
        <div className="mt-4">
          <span className="text-4xl font-bold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: plan.currency,
            }).format(plan.price)}
          </span>
          <span className="text-muted-foreground">/{plan.billingCycle.toLowerCase()}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3 mt-4">
          {plan.entitlements.map((evt) => (
            <li key={evt.featureKey} className="flex items-start gap-2">
              {evt.enabled ? (
                <Check className="h-5 w-5 text-primary shrink-0" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <span className={evt.enabled ? 'text-foreground' : 'text-muted-foreground'}>
                {evt.name}{' '}
                {evt.limit !== undefined && (
                  <span className="font-medium">
                    (Limit: {evt.limit} {evt.unit})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrent ? 'outline' : 'default'}
          disabled={isCurrent || loading}
          onClick={() => onSelect?.(plan.id)}
        >
          {isCurrent ? 'Active Plan' : loading ? 'Processing...' : 'Switch Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
};
