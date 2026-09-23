import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAvailablePlans } from '../hooks/useSaaS';
import { Money } from '@/components/finance/Money';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle } from 'lucide-react';

export const AdminPlansList: React.FC = () => {
  const { data: plans, isLoading } = useAvailablePlans();

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">SaaS Plans & Entitlements</h2>
          <p className="text-muted-foreground mt-1">
            Global configuration of subscription plans tailored to platform tenants. 
            (Mutation capabilities depend on backend implementation)
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Skeleton className="h-[400px] w-full" />
           <Skeleton className="h-[400px] w-full" />
        </div>
      ) : !plans || plans.length === 0 ? (
        <div className="text-center p-12 text-muted-foreground">
          <p>No SaaS Plans found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="text-4xl font-bold">
                    <Money amountMinorUnits={plan.priceMinorUnits!} currencyCode={plan.currency} />
                  </span>
                  <span className="text-muted-foreground">/{plan.billingCycle.toLowerCase()}</span>
                </div>
                <h4 className="font-semibold mb-2">Entitlements:</h4>
                <div className="space-y-2 flex-1">
                  {plan.entitlements.map((ent) => (
                    <div key={ent.featureKey} className="flex items-center gap-2 text-sm">
                      {ent.enabled ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{ent.name}</span>
                        {ent.enabled && (
                          <span className="text-xs text-muted-foreground">
                            {ent.limit ? `Limit: ${ent.limit} ${ent.unit || ''}` : 'Unlimited'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
