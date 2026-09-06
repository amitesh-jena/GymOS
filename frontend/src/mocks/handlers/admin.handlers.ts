import { http, HttpResponse, delay } from 'msw';
import { PlatformTenant, Entitlement } from '../../features/saas/types';

const mockEntitlements: Entitlement[] = [
  { featureKey: 'max_branches', name: 'Max Branches', enabled: true, limit: 1 },
  { featureKey: 'analytics', name: 'Advanced Analytics', enabled: false },
  { featureKey: 'api_access', name: 'API Access', enabled: true },
];

const mockTenants: PlatformTenant[] = [
  {
    id: 'tnt-gym-001',
    name: 'Iron Temple Gym',
    ownerName: 'Arnold S.',
    ownerEmail: 'arnold@irontemple.example.com',
    status: 'ACTIVE',
    subscription: {
      id: 'sub-001',
      tenantId: 'tnt-gym-001',
      planId: 'plan-pro',
      status: 'ACTIVE',
      currentPeriodStart: '2026-09-01T00:00:00Z',
      currentPeriodEnd: '2026-10-01T00:00:00Z',
      cancelAtPeriodEnd: false,
      plan: {
        id: 'plan-pro',
        name: 'Professional',
        description: 'Advanced metrics and multi-branch.',
        billingCycle: 'MONTHLY',
        price: 99.0,
        currency: 'USD',
        entitlements: [
          ...mockEntitlements,
          { featureKey: 'max_branches', name: 'Max Branches', enabled: true, limit: 3 },
          { featureKey: 'analytics', name: 'Advanced Analytics', enabled: true },
        ],
      },
    },
    memberCount: 405,
    branchCount: 2,
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'tnt-gym-002',
    name: 'Cardio Kingdom',
    ownerName: 'Jane Smith',
    ownerEmail: 'jane@cardiokingdom.example.com',
    status: 'ACTIVE',
    subscription: {
      id: 'sub-002',
      tenantId: 'tnt-gym-002',
      planId: 'plan-starter',
      status: 'TRIAL',
      currentPeriodStart: '2026-09-05T00:00:00Z',
      currentPeriodEnd: '2026-09-19T00:00:00Z', // 14 day trial
      cancelAtPeriodEnd: false,
      plan: {
        id: 'plan-starter',
        name: 'Starter',
        description: 'Basic gym management.',
        billingCycle: 'MONTHLY',
        price: 29.0,
        currency: 'USD',
        entitlements: mockEntitlements,
      },
    },
    memberCount: 15,
    branchCount: 1,
    createdAt: '2026-09-05T00:00:00Z',
  },
  {
    id: 'tnt-gym-003',
    name: 'Goliath Fitness (Suspended)',
    ownerName: 'John Doe',
    ownerEmail: 'john@goliath.example.com',
    status: 'SUSPENDED',
    subscription: {
      id: 'sub-003',
      tenantId: 'tnt-gym-003',
      planId: 'plan-pro',
      status: 'CANCELLED',
      currentPeriodStart: '2026-07-01T00:00:00Z',
      currentPeriodEnd: '2026-08-01T00:00:00Z',
      cancelAtPeriodEnd: true,
      plan: {
        id: 'plan-pro',
        name: 'Professional',
        description: 'Advanced metrics and multi-branch.',
        billingCycle: 'MONTHLY',
        price: 99.0,
        currency: 'USD',
        entitlements: mockEntitlements,
      },
    },
    memberCount: 300,
    branchCount: 1,
    createdAt: '2024-11-20T00:00:00Z',
  },
];

export const adminHandlers = [
  http.get('/api/v1/admin/tenants', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';

    let results = mockTenants;
    if (search) {
      results = results.filter(
        (tenant) =>
          tenant.name.toLowerCase().includes(search) ||
          tenant.ownerName.toLowerCase().includes(search)
      );
    }

    return HttpResponse.json({ success: true, data: results });
  }),

  http.get('/api/v1/admin/tenants/:id', async ({ params }) => {
    await delay(300);
    const tenant = mockTenants.find((t) => t.id === params.id);
    if (!tenant) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: tenant });
  }),
];
