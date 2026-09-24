import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { WorkspaceProvider, useWorkspace } from '../src/contexts/WorkspaceContext';
import { DomainProvider } from '../src/contexts/DomainContext';
import { User, TenantRelationship } from '../src/types/identity';
import { ROLES } from '../src/types/roles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockComplexUser: User = {
  id: 'usr-1',
  name: 'Rahul',
  email: 'rahul@gymc.local',
  tenants: [
    {
      tenantId: 'tnt-gymc',
      tenantName: 'Gym C',
      staffProfile: {
        id: 'staff-1',
        roleAssignments: [
          {
            id: 'assignment-trainer',
            role: ROLES.TRAINER,
            branches: [{ branchId: 'branch-1', name: 'Branch 1' }]
          },
          {
            id: 'assignment-manager',
            role: ROLES.BRANCH_MANAGER,
            branches: [{ branchId: 'branch-1', name: 'Branch 1' }, { branchId: 'branch-2', name: 'Branch 2' }]
          }
        ]
      },
      memberProfile: { id: 'member-1', branchId: 'branch-1' }
    },
    {
      tenantId: 'tnt-gym-d',
      tenantName: 'Gym D',
      staffProfile: {
        id: 'staff-2',
        roleAssignments: [
          {
            id: 'assignment-owner',
            role: ROLES.OWNER,
            branches: []
          }
        ]
      }
    }
  ]
};

const TestComponent = () => {
  const { login } = useAuth();
  const { 
    workspaceView,
    activeTenant, 
    activeRoleAssignment,
    activeMemberProfile, 
    activeBranch,
    availableTenants,
    availableRoleAssignments,
    availableBranches,
    setWorkspaceView,
    setActiveTenant,
    setActiveRoleAssignment,
    setActiveBranch
  } = useWorkspace();

  return (
    <div>
      <button onClick={() => login(mockComplexUser)}>Login</button>
      <div data-testid="workspace-view">{workspaceView}</div>
      <div data-testid="tenant">{activeTenant?.tenantName}</div>
      <div data-testid="role">{activeRoleAssignment?.role || 'NONE'}</div>
      <div data-testid="member-profile">{activeMemberProfile?.id || 'NONE'}</div>
      <div data-testid="branch">{activeBranch?.name}</div>
      
      <div data-testid="tenant-count">{availableTenants.length}</div>
      <div data-testid="role-count">{availableRoleAssignments.length}</div>
      <div data-testid="branch-count">{availableBranches.length}</div>

      <button onClick={() => setActiveTenant('tnt-gym-d')}>Select Gym D</button>
      <button onClick={() => setActiveTenant('tnt-gymc')}>Select Gym C</button>
      <button onClick={() => setActiveRoleAssignment('assignment-manager')}>Select Manager View</button>
      <button onClick={() => setWorkspaceView('MEMBER')}>Switch to Member View</button>
      <button onClick={() => setWorkspaceView('STAFF')}>Switch to Staff View</button>
      <button onClick={() => setActiveBranch('branch-2')}>Select Branch 2</button>
    </div>
  );
};

describe('Workspace Context', () => {
  it('supports representing and navigating complex identical model', async () => {
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <DomainProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <TestComponent />
          </WorkspaceProvider>
        </AuthProvider>
        </DomainProvider>
      </QueryClientProvider>
    );

    // Initial State is unauthenticated
    expect(screen.getByTestId('tenant').textContent).toBe('');
    
    // Login
    act(() => {
      screen.getByText('Login').click();
    });

    // 1. User can contain multiple tenant relationships
    expect(screen.getByTestId('tenant-count').textContent).toBe('2');
    
    // 2. User can have multiple role assignments (trainer + manager)
    // 3. User can have both staff and member profiles in one tenant (Gym C)
    // Trainer (staff) + Manager (staff) = 2
    expect(screen.getByTestId('role-count').textContent).toBe('2');
    expect(screen.getByTestId('workspace-view').textContent).toBe('STAFF');

    // 5. Workspace can select a tenant automatically
    expect(screen.getByTestId('tenant').textContent).toBe('Gym C'); // Defaults to first
    expect(screen.getByTestId('role').textContent).toBe(ROLES.TRAINER); // Defaults to first
    // Member profile coexists
    expect(screen.getByTestId('member-profile').textContent).toBe('member-1');

    // 4. Role assignments can have branch access
    expect(screen.getByTestId('branch-count').textContent).toBe('1');
    expect(screen.getByTestId('branch').textContent).toBe('Branch 1'); // Defaults to first

    // 6. Workspace can select a role assignment
    act(() => {
      screen.getByText('Select Manager View').click();
    });

    expect(screen.getByTestId('role').textContent).toBe(ROLES.BRANCH_MANAGER);
    expect(screen.getByTestId('branch-count').textContent).toBe('2');

    // Workspace can switch to MEMBER view exposing member branch
    act(() => {
      screen.getByText('Switch to Member View').click();
    });
    
    expect(screen.getByTestId('workspace-view').textContent).toBe('MEMBER');
    expect(screen.getByTestId('branch-count').textContent).toBe('1');
    expect(screen.getByTestId('branch').textContent).toBe('Member Branch'); // Name defaulted in context
    
    // 7. Re-switching to Staff preserves or defaults staff context
    act(() => {
      screen.getByText('Switch to Staff View').click();
      screen.getByText('Select Branch 2').click();
    });
    expect(screen.getByTestId('workspace-view').textContent).toBe('STAFF');
    expect(screen.getByTestId('branch').textContent).toBe('Branch 2');

    // Switch to a different tenant
    act(() => {
      screen.getByText('Select Gym D').click();
    });
    
    expect(screen.getByTestId('tenant').textContent).toBe('Gym D');
    expect(screen.getByTestId('role').textContent).toBe(ROLES.OWNER); // Re-defaults to first valid role
    expect(screen.getByTestId('member-profile').textContent).toBe('NONE'); // Gym D has no member profile
    expect(screen.getByTestId('branch-count').textContent).toBe('0'); // Owner might have no specific branch array

    // 8. Switching role/view does not replace the authenticated User.
    // (We did not login again, same context structure)
  });
});

