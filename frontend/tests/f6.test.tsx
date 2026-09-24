import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { DomainProvider } from '../src/contexts/DomainContext';
import { WorkspaceProvider, useWorkspace } from '../src/contexts/WorkspaceContext';
import { PermissionProvider } from '../src/contexts/PermissionContext';
import { EntitlementProvider, useEntitlements } from '../src/contexts/EntitlementContext';
import { EntitlementGate } from '../src/components/auth/EntitlementGate';
import { LimitGate } from '../src/components/auth/LimitGate';
import { RequireEntitlement } from '../src/routes/Guards';
import { User } from '../src/types/identity';
import { ROLES } from '../src/types/roles';

// MSW provides default subscription for tenant-1 (ACTIVE, Professional plan, workouts enabled, multi_branch disabled)
const mockUser: User = {
  id: 'usr-f6',
  name: 'F6 User',
  email: 'f6@gymos.app',
  tenants: [
    {
      tenantId: 'tenant-1',
      tenantName: 'Gym A (Professional)',
      staffProfile: {
        id: 'staff-1',
        roleAssignments: [
          {
            id: 'assignment-owner',
            role: ROLES.OWNER,
            branches: []
          }
        ]
      }
    },
    {
      tenantId: 'tenant-2',
      tenantName: 'Gym B (Starter)',
      staffProfile: {
        id: 'staff-2',
        roleAssignments: [
          {
            id: 'assignment-owner-2',
            role: ROLES.OWNER,
            branches: []
          }
        ]
      }
    }
  ]
};

// We will test multiple tiers, MSW needs to let us swap subscription per tenant maybe?
// Let's rely on MSW default for tenant-1 and then we can mock the hook if we want to test tenant swaps.
// Actually, `useSaaS` hits the API so MSW intercept defaults it. We can just mock the hook directly for isolation.

jest.mock('../src/features/saas/hooks/useSaaS', () => ({
  useCurrentSubscription: (tenantId: string) => {
    if (tenantId === 'tenant-1') {
      return {
        data: {
          id: 'sub-1', planId: 'plan-pro', status: 'ACTIVE',
          plan: {
            id: 'plan-pro',
            entitlements: [
              { featureKey: 'workouts', enabled: true },
              { featureKey: 'multi_branch', enabled: false }
            ]
          }
        },
        isLoading: false
      };
    }
    if (tenantId === 'tenant-2') {
      return {
        data: {
          id: 'sub-2', planId: 'plan-starter', status: 'ACTIVE',
          plan: {
            id: 'plan-starter',
            entitlements: [
              { featureKey: 'workouts', enabled: false },
              { featureKey: 'multi_branch', enabled: false }
            ]
          }
        },
        isLoading: false
      };
    }
    if (tenantId === 'tenant-3') {
      return {
        data: {
          id: 'sub-3', planId: 'plan-starter', status: 'ACTIVE',
          plan: {
            id: 'plan-starter',
            entitlements: [
              { featureKey: 'members.max', enabled: true, limit: 100 }
            ]
          }
        },
        isLoading: false
      };
    }
    return { data: null, isLoading: false };
  }
}));

const TestHarness = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DomainProvider>
          <AuthProvider>
            <WorkspaceProvider>
              <PermissionProvider>
                <EntitlementProvider>
                  {children}
                </EntitlementProvider>
              </PermissionProvider>
            </WorkspaceProvider>
          </AuthProvider>
        </DomainProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const ContextTester = () => {
  const { login } = useAuth();
  const { setActiveTenant } = useWorkspace();
  const { hasEntitlement } = useEntitlements();

  return (
    <div>
      <button onClick={() => login(mockUser)}>Login</button>
      <button onClick={() => setActiveTenant('tenant-1')}>Set Tenant 1</button>
      <button onClick={() => setActiveTenant('tenant-2')}>Set Tenant 2</button>
      <div data-testid="has-workouts">{hasEntitlement('workouts') ? 'YES' : 'NO'}</div>
      <div data-testid="has-multi-branch">{hasEntitlement('multi_branch') ? 'YES' : 'NO'}</div>
    </div>
  );
};

describe('F6: Entitlement Context & Gate', () => {
  it('supplies valid feature gating logic tied to tenant subscription', async () => {
    render(
      <TestHarness>
        <ContextTester />
      </TestHarness>
    );

    // Not logged in yet
    expect(screen.getByTestId('has-workouts')).toHaveTextContent('NO');
    
    // Login -> defaults to tenant-1 (Pro Plan, workouts enabled, multi disabled)
    act(() => { screen.getByText('Login').click(); });
    expect(screen.getByTestId('has-workouts')).toHaveTextContent('YES');
    expect(screen.getByTestId('has-multi-branch')).toHaveTextContent('NO');

    // Switch tenant to tenant-2 (Starter Plan, all disabled)
    act(() => { screen.getByText('Set Tenant 2').click(); });
    expect(screen.getByTestId('has-workouts')).toHaveTextContent('NO');
    expect(screen.getByTestId('has-multi-branch')).toHaveTextContent('NO');
  });

  it('EntitlementGate falls back to Upgrade Prompt if unauthorized', async () => {
    const GateTester = () => {
      const { login } = useAuth();
      return (
        <div>
          <button onClick={() => login(mockUser)}>Login</button>
          <EntitlementGate feature="multi_branch" showUpgradePrompt>
            <div data-testid="premium-content">Premium Multi-Branch View</div>
          </EntitlementGate>
        </div>
      );
    };

    render(
      <TestHarness>
        <GateTester />
      </TestHarness>
    );

    act(() => { screen.getByText('Login').click(); });
    // Tenant-1 doesn't have multi_branch
    expect(screen.queryByTestId('premium-content')).not.toBeInTheDocument();
    expect(screen.getByText('Feature Locked')).toBeInTheDocument();
    expect(screen.getByText(/upgrade to unlock/i)).toBeInTheDocument();
  });

  it('RequireEntitlement blocks navigation for restricted routes and displays upgrade prompt', async () => {
    const RoutingTester = () => {
      const { login } = useAuth();
      return (
        <div>
          <button onClick={() => login(mockUser)}>Login</button>
          <Routes>
            <Route element={<RequireEntitlement feature="multi_branch" />}>
              <Route path="/" element={<div data-testid="restricted-route">Restricted Route</div>} />
            </Route>
          </Routes>
        </div>
      );
    };

    render(
      <TestHarness>
        <RoutingTester />
      </TestHarness>
    );

    act(() => { screen.getByText('Login').click(); });
    // Should be blocked
    expect(screen.queryByTestId('restricted-route')).not.toBeInTheDocument();
    expect(screen.getByText('Feature Unavailable')).toBeInTheDocument();
  });

  describe('LimitGate functionality', () => {
    it('allows access when usage is below the configured limit', async () => {
      const LimitTester = () => {
        const { login } = useAuth();
        return (
          <div>
            <button onClick={() => login(mockUser)}>Login</button>
            <LimitGate feature="workouts" currentUsage={5} showUpgradePrompt>
              <div data-testid="limited-content">Within Limits</div>
            </LimitGate>
          </div>
        );
      };

      // Our mock sets `workouts: { enabled: true }` but no limit for tenant-1
      render(
        <TestHarness>
          <LimitTester />
        </TestHarness>
      );

      act(() => { screen.getByText('Login').click(); });
      // No limit configured -> should always render
      expect(screen.getByTestId('limited-content')).toBeInTheDocument();
    });

    it('denies access when usage is exactly at or above the configured limit', async () => {
      // Temporarily override the mock for this specific test
      // Actually we'll just test tenant-3 which we can add to the mock to have a strict limit
      const tenant3User = {
        ...mockUser,
        tenants: [
          {
            tenantId: 'tenant-3',
            tenantName: 'Gym C (Limited Starter)',
            staffProfile: { id: 'staff-3', roleAssignments: [{ id: 'assignment-owner-3', role: ROLES.OWNER as any, branches: [] }] }
          }
        ]
      };

      const LimitTester = () => {
        const { login } = useAuth();
        const { getFeatureLimit } = useEntitlements();
        return (
          <div>
            <button onClick={() => login(tenant3User)}>Login</button>
            <div data-testid="limit-val">{getFeatureLimit('members.max') || 'UNLIMITED'}</div>
            <LimitGate feature="members.max" currentUsage={100} showUpgradePrompt>
              <div data-testid="under-limit-content">Should Fail</div>
            </LimitGate>
            <LimitGate feature="members.max" currentUsage={99} showUpgradePrompt>
              <div data-testid="under-limit-content-success">Should Pass</div>
            </LimitGate>
          </div>
        );
      };

      render(
        <TestHarness>
          <LimitTester />
        </TestHarness>
      );

      act(() => { screen.getByText('Login').click(); });
      
      // Tenant 3 limit is 100
      expect(screen.getByTestId('limit-val')).toHaveTextContent('100');
      
      // 99 < 100
      expect(screen.getByTestId('under-limit-content-success')).toBeInTheDocument();
      
      // 100 >= 100, shows Limit Reached
      expect(screen.queryByTestId('under-limit-content')).not.toBeInTheDocument();
      expect(screen.getByText('Usage Limit Reached')).toBeInTheDocument();
    });
  });
});
