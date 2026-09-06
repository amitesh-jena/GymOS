import { http, HttpResponse } from 'msw';
import { SaaSSubscription, SaaSPlan } from '../../features/saas/types';

const MOCK_PLANS: SaaSPlan[] = [
  {
    id: 'plan-starter',
    name: 'Starter',
    description: 'Perfect for small studios scaling up.',
    billingCycle: 'MONTHLY',
    price: 49.99,
    currency: 'USD',
    entitlements: [
      { featureKey: 'members.max', name: 'Active Members', enabled: true, limit: 100 },
      { featureKey: 'core', name: 'Core Operations', enabled: true },
      { featureKey: 'reports.basic', name: 'Basic Reports', enabled: true },
      { featureKey: 'custom.branding', name: 'Custom Branding', enabled: false },
    ],
  },
  {
    id: 'plan-professional',
    name: 'Professional',
    description: 'Everything a growing gym needs to succeed.',
    billingCycle: 'MONTHLY',
    price: 149.99,
    currency: 'USD',
    entitlements: [
      { featureKey: 'members.max', name: 'Active Members', enabled: true }, // unlimited
      { featureKey: 'core', name: 'Core Operations', enabled: true },
      { featureKey: 'reports.advanced', name: 'Advanced Analytics', enabled: true },
      { featureKey: 'workouts', name: 'Workout Builder', enabled: true },
      { featureKey: 'custom.branding', name: 'Custom Branding', enabled: true },
    ],
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    description: 'Ultimate power for multi-location businesses.',
    billingCycle: 'MONTHLY',
    price: 399.99,
    currency: 'USD',
    entitlements: [
      { featureKey: 'members.max', name: 'Active Members', enabled: true },
      { featureKey: 'core', name: 'Core Operations', enabled: true },
      { featureKey: 'reports.advanced', name: 'Advanced Analytics', enabled: true },
      { featureKey: 'multi_branch', name: 'Multi-Branch Support', enabled: true },
      { featureKey: 'workouts', name: 'Workout Builder', enabled: true },
      { featureKey: 'custom.branding', name: 'Custom Branding', enabled: true },
    ],
  },
];

let currentSubscription: SaaSSubscription = {
  id: 'sub_xyz123',
  tenantId: 'tenant-1',
  planId: 'plan-professional',
  status: 'ACTIVE',
  currentPeriodStart: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
  currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
  cancelAtPeriodEnd: false,
};

export const saasHandlers = [
  http.get('/api/v1/subscriptions/plans', () => {
    return HttpResponse.json({ success: true, data: MOCK_PLANS });
  }),

  http.get('/api/v1/subscriptions/current', () => {
    // Populate plan object for frontend convenience
    const plan = MOCK_PLANS.find((p) => p.id === currentSubscription.planId);
    return HttpResponse.json({ success: true, data: { ...currentSubscription, plan } });
  }),

  http.post('/api/v1/subscriptions/current/cancel', () => {
    currentSubscription = {
      ...currentSubscription,
      cancelAtPeriodEnd: true,
      status: 'CANCELLED',
    };
    const plan = MOCK_PLANS.find((p) => p.id === currentSubscription.planId);
    return HttpResponse.json({ success: true, data: { ...currentSubscription, plan } });
  }),

  http.post('/api/v1/subscriptions/current/change', async ({ request }) => {
    const { planId } = (await request.json()) as { planId: string };

    currentSubscription = {
      ...currentSubscription,
      planId,
      status: 'ACTIVE',
      cancelAtPeriodEnd: false,
    };
    const plan = MOCK_PLANS.find((p) => p.id === planId);
    return HttpResponse.json({ success: true, data: { ...currentSubscription, plan } });
  }),
];
