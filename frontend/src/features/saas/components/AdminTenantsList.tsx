import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformTenants } from '../hooks/useAdmin';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Search } from 'lucide-react';
import { PlatformTenant } from '../types';

export const AdminTenantsList: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: tenants, isLoading, isError } = usePlatformTenants({ search });
  const navigate = useNavigate();

  const getStatusBadge = (tenant: PlatformTenant) => {
    switch (tenant.status) {
      case 'ACTIVE':
        return <Badge variant="default">ACTIVE</Badge>;
      case 'SUSPENDED':
        return <Badge variant="destructive">SUSPENDED</Badge>;
      case 'PROVISIONING':
        return <Badge variant="secondary">PROVISIONING</Badge>;
      default:
        return <Badge variant="outline">{tenant.status}</Badge>;
    }
  };

  const getSubscriptionBadge = (tenant: PlatformTenant) => {
    const status = tenant.subscription.status;
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge variant="default" className="bg-green-600">
            ACTIVE
          </Badge>
        );
      case 'TRIAL':
        return <Badge variant="secondary">TRIAL</Badge>;
      case 'GRACE_PERIOD':
        return <Badge variant="destructive">GRACE</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline">CANCELLED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Platform Tenants</h2>
          <p className="text-muted-foreground mt-1">
            SaaS administration and cross-tenant overview.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="py-4 border-b">
          <div className="flex items-center space-x-2 w-full max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center text-destructive p-12">
              <AlertCircle className="h-10 w-10 mb-4" />
              <h3 className="text-lg font-semibold">Unable to load tenants</h3>
              <p>Verify platform availability and try again.</p>
            </div>
          ) : !tenants || tenants.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">
              <p>No tenants found</p>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead className="text-right">Members</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow
                      key={tenant.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/admin/tenants/${tenant.id}`)}
                    >
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{tenant.ownerName}</span>
                          <span className="text-xs text-muted-foreground">{tenant.ownerEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(tenant)}</TableCell>
                      <TableCell>{tenant.subscription.plan?.name || 'Unknown'}</TableCell>
                      <TableCell>{getSubscriptionBadge(tenant)}</TableCell>
                      <TableCell className="text-right">{tenant.memberCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
