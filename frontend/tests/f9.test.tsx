/// <reference types="jest" />
import React, { useEffect } from 'react';
import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { DomainProvider } from '../src/contexts/DomainContext';
import { WorkspaceProvider, useWorkspace } from '../src/contexts/WorkspaceContext';
import { PermissionProvider, usePermissions } from '../src/contexts/PermissionContext';
import { EntitlementProvider, useEntitlements } from '../src/contexts/EntitlementContext';
import { RequirePermission } from '../src/routes/Guards';
import { PERMISSIONS } from '../src/types/permissions';
import { ROLES } from '../src/types/roles';
import { User } from '../src/types/identity';
import { getNavForPermissions } from '../src/routes/config';

// ----------------------------------------------------
// Mock Data
// ----------------------------------------------------

const mockMultiRoleUser: User = {
  id: 'usr-f9-multi',
  name: 'Multi Role User',
  email: 'multirole@gymos.app',
  tenants: [
    {
      tenantId: 'tnt-single-branch',
      tenantName: 'Gym A (Single Branch)',
      staffProfile: {
        id: 'staff-trainer',
        roleAssignments: [
          {
            id: 'assignment-trainer',
            role: ROLES.TRAINER,
            branches: [{ branchId: 'br-main', name: 'Main Branch' }]
          }
        ]
      },
      memberProfile: {
        id: 'mem-001',
        branchId: 'br-main'
      }
    },
    {
      tenantId: 'tnt-multi-branch',
      tenantName: 'Gym B (Multiple Branches)',
      staffProfile: {
        id: 'staff-owner',
        roleAssignments: [
          {
            id: 'assignment-owner',
            role: ROLES.OWNER,
            branches: [] // Global across tenant
          }
        ]
      }
    }
  ]
};

const mockSuperAdmin: User = {
  id: 'usr-f9-sa',
  name: 'Super Admin User',
  email: 'admin@gymos.app',
  tenants: [
    {
      tenantId: 'platform',
      tenantName: 'Platform Network',
      staffProfile: {
        id: 'staff-sa',
        roleAssignments: [
          {
            id: 'assignment-sa',
            role: ROLES.SUPER_ADMIN,
            branches: []
          }
        ]
      }
    }
  ]
};

jest.mock('../src/features/saas/hooks/useSaaS', () => ({
  useCurrentSubscription: () => ({
    data: {
      plan: {
        entitlements: [
          { featureKey: 'workouts', enabled: true },
          { featureKey: 'multi_branch', limit: 3 }
        ]
      }
    },
    isLoading: false
  })
}));

// ----------------------------------------------------
// Helpers
// ----------------------------------------------------

const TestHarness = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
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

const AuthTrigger = ({ user, tenantId, roleAssignmentId }: { user: User, tenantId?: string, roleAssignmentId?: string }) => {
  const { login } = useAuth();
  const { setActiveTenant, setActiveRoleAssignment } = useWorkspace();
  
  return (
    <button
      data-testid="trigger"
      onClick={() => {
        login(user);
        if (tenantId) setActiveTenant(tenantId);
        if (roleAssignmentId) setActiveRoleAssignment(roleAssignmentId);
      }}
    >
      Login
    </button>
  );
};

// ----------------------------------------------------
// Tests
// ----------------------------------------------------

describe('F9: Role Regression & Auth Architecture', () => {
  
  describe('Permission Resolving & Multi-Role Identity (Trainer + Member)', () => {
    it('unions member and trainer permissions within the same tenant/branch correctly', async () => {
      const Inspector = () => {
        const { hasPermission } = usePermissions();
        return (
          <div data-testid="perms">
            {hasPermission(PERMISSIONS.MEMBERSHIP_VIEW) ? 'MEMBER_OK' : ''}
            {hasPermission(PERMISSIONS.WORKOUT_VIEW) ? 'TRAINER_OK' : ''}
            {hasPermission(PERMISSIONS.TENANT_VIEW) ? 'SA_OK' : ''}
            {hasPermission(PERMISSIONS.PLAN_MANAGE_SAAS) ? 'SA_PLAN_OK' : ''}
          </div>
        );
      };

      render(
        <TestHarness>
          <AuthTrigger user={mockMultiRoleUser} tenantId="tnt-single-branch" />
          <Inspector />
        </TestHarness>
      );
      
      act(() => { screen.getByTestId('trigger').click(); });

      const perms = await screen.findByTestId('perms');
      expect(perms).toHaveTextContent(/MEMBER_OK/);
      expect(perms).toHaveTextContent(/TRAINER_OK/);
      expect(perms).not.toHaveTextContent(/SA_OK/);
    });

    it('member branch scopes are respected explicitly', async () => {
      const Inspector = () => {
        const { availableBranches } = useWorkspace();
        return (
          <div data-testid="branches">
            {availableBranches.map(b => b.branchId).join(',')}
          </div>
        );
      };
      
      render(
        <TestHarness>
          <AuthTrigger user={mockMultiRoleUser} tenantId="tnt-single-branch" />
          <Inspector />
        </TestHarness>
      );
      
      act(() => { screen.getByTestId('trigger').click(); });

      const branches = await screen.findByTestId('branches');
      expect(branches).toHaveTextContent('br-main'); 
    });
  });

  describe('Tenant Switching', () => {
    it('updates role context cleanly when switching tenants', async () => {
      const Inspector = () => {
        const { hasPermission } = usePermissions();
        return (
          <div data-testid="perms">
            {hasPermission(PERMISSIONS.BRANCH_CREATE) ? 'OWNER_OK' : 'DENIED'}
          </div>
        );
      };

      // When mapped to tnt-single-branch, user is a Trainer. Branch Create is denied.
      const { rerender } = render(
        <TestHarness>
          <AuthTrigger user={mockMultiRoleUser} tenantId="tnt-single-branch" />
          <Inspector />
        </TestHarness>
      );
      act(() => { screen.getByTestId('trigger').click(); });

      let perms = await screen.findByTestId('perms');
      expect(perms).toHaveTextContent('DENIED');

      // Swap to tnt-multi-branch where the user is an OWNER.
      rerender(
        <TestHarness>
          <AuthTrigger user={mockMultiRoleUser} tenantId="tnt-multi-branch" />
          <Inspector />
        </TestHarness>
      );
      act(() => { screen.getByTestId('trigger').click(); });

      perms = await screen.findByTestId('perms');
      expect(perms).toHaveTextContent('OWNER_OK');
    });
  });

  describe('Super Admin Isolation', () => {
    it('Super Admins can access TENANT_VIEW and PLAN_MANAGE_SAAS', async () => {
      const Inspector = () => {
        const { hasPermission } = usePermissions();
        return (
          <div data-testid="sa-perms">
            {hasPermission(PERMISSIONS.TENANT_VIEW) ? 'OK' : 'FAIL'}
            {hasPermission(PERMISSIONS.PLAN_MANAGE_SAAS) ? 'OK' : 'FAIL'}
          </div>
        );
      };

      render(
        <TestHarness>
          <AuthTrigger user={mockSuperAdmin} tenantId="platform" />
          <Inspector />
        </TestHarness>
      );
      act(() => { screen.getByTestId('trigger').click(); });

      const perms = await screen.findByTestId('sa-perms');
      expect(perms).toHaveTextContent('OKOK'); // Both permissions present
    });
  });

  describe('Sidebar Content Generation', () => {
    it('generates completely isolated sidebar tools for Super Admins', async () => {
      let allowedRoutes: string[] = [];

      const DynamicSidebar = () => {
        const { hasPermission } = usePermissions();
        const nav = getNavForPermissions(hasPermission);
        allowedRoutes = nav.map(n => n.route);
        return <div data-testid="nav-ok">Ready</div>;
      };

      render(
        <TestHarness>
          <AuthTrigger user={mockSuperAdmin} tenantId="platform" />
          <DynamicSidebar />
        </TestHarness>
      );
      act(() => { screen.getByTestId('trigger').click(); });

      await screen.findByTestId('nav-ok');
      expect(allowedRoutes).toContain('/admin/tenants');
      expect(allowedRoutes).toContain('/admin/plans');
      expect(allowedRoutes).not.toContain('/dashboard');
      expect(allowedRoutes).not.toContain('/member/dashboard');
    });

    it('generates strictly member workflows for members', async () => {
      let allowedRoutes: string[] = [];
      const DynamicSidebar = () => {
        const { hasPermission } = usePermissions();
        allowedRoutes = getNavForPermissions(hasPermission).map(n => n.route);
        return <div data-testid="nav-ok">Ready</div>;
      };

      const memberOnlyUser: User = { ...mockMultiRoleUser, tenants: [{ ...mockMultiRoleUser.tenants[0], staffProfile: undefined }] };

      render(
        <TestHarness>
          <AuthTrigger user={memberOnlyUser} tenantId="tnt-single-branch" />
          <DynamicSidebar />
        </TestHarness>
      );
      act(() => { screen.getByTestId('trigger').click(); });

      await screen.findByTestId('nav-ok');
      expect(allowedRoutes).toContain('/member/dashboard');
      expect(allowedRoutes).toContain('/member/workouts');
      expect(allowedRoutes).not.toContain('/admin/tenants');
      expect(allowedRoutes).not.toContain('/dashboard');
    });
  });
});
