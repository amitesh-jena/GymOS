import React from 'react';
import { usePlatformTenants } from '../hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, CreditCard, ShieldAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { data: tenants, isLoading } = usePlatformTenants({});
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  const totalTenants = tenants?.length || 0;
  const activeTenants = tenants?.filter(t => t.status === 'ACTIVE').length || 0;
  const totalMembers = tenants?.reduce((sum, t) => sum + t.memberCount, 0) || 0;
  const activeSubscriptions = tenants?.filter(t => t.subscription.status === 'ACTIVE').length || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Platform Dashboard</h2>
        <p className="text-muted-foreground mt-1">Super Admin overview of entire GymOS platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate('/admin/tenants')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTenants}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeTenants} currently active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Platform Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all available tenants
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate('/admin/plans')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Billed through SaaS plans
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate('/admin/health')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <ShieldAlert className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Stable</div>
            <p className="text-xs text-muted-foreground mt-1">
              All core services operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
         <Card>
           <CardHeader>
             <CardTitle>Recent Tenants</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               {tenants?.slice(0, 3).map(tenant => (
                 <div key={tenant.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                   <div>
                     <p className="font-medium text-sm">{tenant.name}</p>
                     <p className="text-xs text-muted-foreground">{tenant.ownerEmail}</p>
                   </div>
                   <div className="text-xs bg-muted px-2 py-1 rounded">
                     {tenant.status}
                   </div>
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>
      </div>
    </div>
  );
};
