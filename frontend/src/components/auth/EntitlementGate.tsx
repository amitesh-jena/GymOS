import { ReactNode } from 'react';
import { useEntitlements } from '@/contexts/EntitlementContext';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { ROLES } from '@/types/roles';
import { Skeleton } from '@/components/ui/skeleton';

export interface EntitlementGateProps {
  feature: string | string[];
  requireAll?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
  upgradeTitle?: string;
  upgradeDescription?: string;
}

export function EntitlementGate({
  feature,
  requireAll = false,
  children,
  fallback,
  showUpgradePrompt = false,
  upgradeTitle = 'Feature Locked',
  upgradeDescription = 'This feature is not available on your current plan. Upgrade to unlock this functionality.',
}: EntitlementGateProps) {
  const { hasAnyEntitlement, hasAllEntitlements, isLoading } = useEntitlements();
  const { activeRoleAssignment } = useWorkspace();
  const navigate = useNavigate();

  if (isLoading) {
    if (fallback) return <>{fallback}</>;
    return <Skeleton className="w-full h-32 rounded-lg" />;
  }

  const features = Array.isArray(feature) ? feature : [feature];
  const isEntitled = requireAll 
    ? hasAllEntitlements(features) 
    : hasAnyEntitlement(features);

  if (isEntitled) {
    return <>{children}</>;
  }

  if (fallback !== undefined && !showUpgradePrompt) {
    return <>{fallback}</>;
  }

  if (showUpgradePrompt) {
    const isOwner = activeRoleAssignment?.role === ROLES.OWNER;
    return (
      <Card className="w-full max-w-md mx-auto my-8 border-dashed border-2">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-muted rounded-full">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          <CardTitle>{upgradeTitle}</CardTitle>
          <CardDescription>{upgradeDescription}</CardDescription>
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
