import { ReactNode } from 'react';
import { useEntitlements } from '@/contexts/EntitlementContext';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { ROLES } from '@/types/roles';
import { Skeleton } from '@/components/ui/skeleton';

export interface LimitGateProps {
  feature: string;
  currentUsage: number;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

export function LimitGate({
  feature,
  currentUsage,
  children,
  fallback,
  showUpgradePrompt = false,
}: LimitGateProps) {
  const { getFeatureLimit, hasEntitlement, isLoading } = useEntitlements();
  const { activeRoleAssignment } = useWorkspace();
  const navigate = useNavigate();

  if (isLoading) {
    if (fallback) return <>{fallback}</>;
    return <Skeleton className="w-full h-32 rounded-lg" />;
  }

  // Fallback to normal disabled check if entirely un-entitled
  const isEnabled = hasEntitlement(feature);
  if (!isEnabled) {
    if (fallback !== undefined && !showUpgradePrompt) {
      return <>{fallback}</>;
    }
    return null; 
  }

  const limit = getFeatureLimit(feature);
  const isLimitReached = limit !== undefined && currentUsage >= limit;

  if (!isLimitReached) {
    return <>{children}</>;
  }

  if (fallback !== undefined && !showUpgradePrompt) {
    return <>{fallback}</>;
  }

  if (showUpgradePrompt) {
    const isOwner = activeRoleAssignment?.role === ROLES.OWNER;
    return (
      <Card className="w-full max-w-md mx-auto my-8 border-dashed border-2 border-destructive/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </div>
          <CardTitle>Usage Limit Reached</CardTitle>
          <CardDescription>
            You have reached the configured limit for this feature ({currentUsage} / {limit}). Please upgrade your plan to increase this limit.
          </CardDescription>
        </CardHeader>
        {isOwner && (
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/settings/subscription')}>
              Upgrade Plan
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }

  return null;
}
