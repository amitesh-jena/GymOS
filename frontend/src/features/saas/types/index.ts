export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'GRACE_PERIOD' | 'EXPIRED' | 'CANCELLED';

export interface Entitlement {
  featureKey: string;
  name: string;
  enabled: boolean;
  limit?: number; // if undefined, unlimited
  unit?: string;
  metadata?: Record<string, unknown>;
}

export interface SaaSPlan {
  id: string;
  name: string;
  description: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  price: number;
  currency: string;
  entitlements: Entitlement[];
  isCurrent?: boolean;
}

export interface SaaSThemeContext {
  color: string;
}

export interface SaaSSubscription {
  id: string;
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  plan?: SaaSPlan; // populated from backend usually
}
