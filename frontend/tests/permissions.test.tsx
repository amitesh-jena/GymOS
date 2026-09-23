import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { WorkspaceProvider, useWorkspace } from '../src/contexts/WorkspaceContext';
import { PermissionProvider, usePermissions } from '../src/contexts/PermissionContext';
import { User } from '../src/types/identity';
import { ROLES } from '../src/types/roles';
import { PERMISSIONS } from '../src/types/permissions';
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
    }
  ]
};

const TestComponent = () => {
  const { login } = useAuth();
  const { setActiveRoleAssignment, setActiveBranch, setWorkspaceView } = useWorkspace();
  const { hasPermission } = usePermissions();

  return (
    <div>
      <button onClick={() => login(mockComplexUser)}>Login</button>
      <button onClick={() => setActiveRoleAssignment('assignment-trainer')}>Set Trainer</button>
      <button onClick={() => setActiveRoleAssignment('assignment-manager')}>Set Manager</button>
      <button onClick={() => setActiveBranch('branch-1')}>Set Branch 1</button>
      <button onClick={() => setActiveBranch('branch-2')}>Set Branch 2</button>
      <button onClick={() => setWorkspaceView('MEMBER')}>Set Member View</button>
      <div data-testid="can-view-member">{hasPermission(PERMISSIONS.MEMBER_VIEW) ? 'YES' : 'NO'}</div>
      <div data-testid="can-view-workout">{hasPermission(PERMISSIONS.WORKOUT_VIEW) ? 'YES' : 'NO'}</div>
      <div data-testid="can-manage-subscription">{hasPermission(PERMISSIONS.SUBSCRIPTION_MANAGE) ? 'YES' : 'NO'}</div>
    </div>
  );
};

describe('Permission Context (F2)', () => {
  it('correctly resolves UNION permissions across active roles and branches', async () => {
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WorkspaceProvider>
            <PermissionProvider>
              <TestComponent />
            </PermissionProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </QueryClientProvider>
    );

    // Initial State is unauthenticated
    expect(screen.getByTestId('can-view-member').textContent).toBe('NO');
    
    // Login
    act(() => { screen.getByText('Login').click(); });
    // Default context selects Gym C, Trainer role, Branch 1.
    // Branch 1 is applicable to BOTH Trainer and Branch Manager roles.
    // Member Profile is also on Branch 1.
    // The UNION should contain:
    // Trainer (MEMBER_VIEW, WORKOUT_VIEW, etc.)
    // Manager (MEMBER_VIEW, PAYMENT_VIEW, etc.)
    // Member (MEMBERSHIP_VIEW, WORKOUT_VIEW, etc.)
    expect(screen.getByTestId('can-view-member').textContent).toBe('YES');
    expect(screen.getByTestId('can-view-workout').textContent).toBe('YES'); // From Trainer & Member roles
    // Nobody has subscription manage in Gym C
    expect(screen.getByTestId('can-manage-subscription').textContent).toBe('NO');
    
    // Switch to Manager role so branch-2 becomes available in WorkspaceContext, then switch to Branch 2
    act(() => { 
        screen.getByText('Set Manager').click();
        screen.getByText('Set Branch 2').click(); 
    });
    // On Branch 2, Trainer role is NOT applicable. Manager role IS applicable. Member role is NOT applicable (it's branch-1 only).
    // So UNION is only Branch Manager.
    // Branch Manager doesn't have WORKOUT_VIEW explicitly mapped in our configuration (only Trainer and Member do)
    expect(screen.getByTestId('can-view-workout').textContent).toBe('NO');
    expect(screen.getByTestId('can-view-member').textContent).toBe('YES');

    // Setting view to Member doesn't break permissions if roles are still applicable
    act(() => { 
        screen.getByText('Set Branch 1').click(); 
        screen.getByText('Set Member View').click();
    });
    // On Branch 1, we get Trainer + Manager + Member permissions regardless of UI purely presentation state View
    expect(screen.getByTestId('can-view-workout').textContent).toBe('YES');
  });
});
