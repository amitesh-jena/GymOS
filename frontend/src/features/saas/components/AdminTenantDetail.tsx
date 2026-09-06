import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlatformTenant } from '../hooks/useAdmin';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft, Building, CheckCircle2, XCircle } from 'lucide-react';

export const AdminTenantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tenant, isLoading, isError } = usePlatformTenant(id || '');

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (isError || !tenant) {
    return (
      <div className="flex flex-col items-center justify-center text-destructive p-12 min-h-[400px]">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-bold">Tenant Not Found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/tenants')}>
          Back to Tenants
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/tenants')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Building className="h-7 w-7" />
            {tenant.name}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Tenant ID: {tenant.id} | Created: {new Date(tenant.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identity & Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Owner Name</span>
              <span className="font-medium">{tenant.ownerName}</span>

              <span className="text-muted-foreground">Contact Email</span>
              <span className="font-medium">{tenant.ownerEmail}</span>

              <span className="text-muted-foreground">Platform Status</span>
              <span>
                <Badge variant={tenant.status === 'ACTIVE' ? 'default' : 'destructive'}>
                  {tenant.status}
                </Badge>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Total Members</span>
              <span className="font-medium">{tenant.memberCount}</span>

              <span className="text-muted-foreground">Active Branches</span>
              <span className="font-medium">{tenant.branchCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription & SaaS Plan</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 space-y-4 text-sm border-r pr-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-bold">{tenant.subscription.plan?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline">{tenant.subscription.status}</Badge>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Cycle</span>
              <span>{tenant.subscription.plan?.billingCycle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Period End</span>
              <span>{new Date(tenant.subscription.currentPeriodEnd).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="col-span-2">
            <h3 className="font-semibold mb-3">Plan Entitlements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tenant.subscription.plan?.entitlements.map((ent) => (
                <div
                  key={ent.featureKey}
                  className="flex items-center gap-2 text-sm border p-2 rounded-md bg-muted/20"
                >
                  {ent.enabled ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{ent.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {ent.limit ? `Limit: ${ent.limit} ${ent.unit || ''}` : 'Unlimited'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {(!tenant.subscription.plan?.entitlements ||
              tenant.subscription.plan.entitlements.length === 0) && (
              <p className="text-muted-foreground text-sm">No entitlements configured.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
