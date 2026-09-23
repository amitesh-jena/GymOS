import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useWorkspace } from './WorkspaceContext';
import { useCurrentSubscription } from '../features/saas/hooks/useSaaS';
import { SaaSSubscription, Entitlement } from '../features/saas/types';

interface EntitlementContextType {
  subscription: SaaSSubscription | null;
  isLoading: boolean;
  getEntitlement: (featureKey: string) => Entitlement | undefined;
  getFeatureLimit: (featureKey: string) => number | undefined;
  hasEntitlement: (featureKey: string) => boolean;
  hasAnyEntitlement: (featureKeys: string[]) => boolean;
  hasAllEntitlements: (featureKeys: string[]) => boolean;
}

const EntitlementContext = createContext<EntitlementContextType | null>(null);

export const EntitlementProvider = ({ children }: { children: ReactNode }) => {
  const { activeTenant } = useWorkspace();
  
  // We only fetch subscription if a tenant is actively selected in the workspace.
  const { data: subscription, isLoading } = useCurrentSubscription(activeTenant?.tenantId);

  const getEntitlement = (featureKey: string): Entitlement | undefined => {
    if (!subscription || !subscription.plan) return undefined;
    return subscription.plan.entitlements.find(e => e.featureKey === featureKey);
  };

  const getFeatureLimit = (featureKey: string): number | undefined => {
    const entitlement = getEntitlement(featureKey);
    return entitlement?.limit;
  };

  // Evaluate if an entitlement is active based on current subscription state.
  // The backend remains authoritative for actual enforcement, this is just for UX gating.
  const hasEntitlement = (featureKey: string): boolean => {
    const entitlement = getEntitlement(featureKey);
    return !!entitlement?.enabled;
  };

  const hasAnyEntitlement = (featureKeys: string[]) => {
    return featureKeys.some(hasEntitlement);
  };

  const hasAllEntitlements = (featureKeys: string[]) => {
    if (featureKeys.length === 0) return true;
    return featureKeys.every(hasEntitlement);
  };

  const value = useMemo(
    () => ({
      subscription: subscription || null,
      isLoading,
      getEntitlement,
      getFeatureLimit,
      hasEntitlement,
      hasAnyEntitlement,
      hasAllEntitlements
    }),
    [subscription, isLoading]
  );

  return (
    <EntitlementContext.Provider value={value}>
      {children}
    </EntitlementContext.Provider>
  );
};

export const useEntitlements = () => {
  const context = useContext(EntitlementContext);
  if (!context) {
    throw new Error('useEntitlements must be used within an EntitlementProvider');
  }
  return context;
};
