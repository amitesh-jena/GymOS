/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { RoleAssignment, TenantRelationship, BranchAccess, MemberProfile } from '@/types/identity';

export type WorkspaceView = 'STAFF' | 'MEMBER';

interface WorkspaceContextType {
  workspaceView: WorkspaceView;
  activeTenant: TenantRelationship | null;
  activeRoleAssignment: RoleAssignment | null;
  activeMemberProfile: MemberProfile | null;
  activeBranch: BranchAccess | null; // Unified resolved branch depending on view

  availableTenants: TenantRelationship[];
  availableRoleAssignments: RoleAssignment[];
  availableBranches: BranchAccess[];

  setWorkspaceView: (view: WorkspaceView) => void;
  setActiveTenant: (tenantId: string) => void;
  setActiveRoleAssignment: (assignmentId: string) => void;
  setActiveBranch: (branchId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  
  const [workspaceViewState, setWorkspaceViewState] = useState<WorkspaceView | null>(null);
  const [activeTenantIdState, setActiveTenantIdState] = useState<string | null>(null);
  const [activeRoleAssignmentIdState, setActiveRoleAssignmentIdState] = useState<string | null>(null);
  const [activeBranchIdState, setActiveBranchIdState] = useState<string | null>(null);

  const availableTenants = useMemo(() => user?.tenants || [], [user?.tenants]);
  
  // Strict resolution of active entity IDs defaulting cleanly if invalid
  const activeTenantId = useMemo(() => {
    if (activeTenantIdState && availableTenants.some(t => t.tenantId === activeTenantIdState)) {
      return activeTenantIdState;
    }
    return availableTenants[0]?.tenantId || null;
  }, [availableTenants, activeTenantIdState]);

  const activeTenant = useMemo(() => 
    availableTenants.find(t => t.tenantId === activeTenantId) || null,
  [availableTenants, activeTenantId]);

  const availableRoleAssignments = useMemo(() => {
    return activeTenant?.staffProfile?.roleAssignments || [];
  }, [activeTenant]);

  const activeRoleAssignmentId = useMemo(() => {
    if (activeRoleAssignmentIdState && availableRoleAssignments.some(r => r.id === activeRoleAssignmentIdState)) {
      return activeRoleAssignmentIdState;
    }
    return availableRoleAssignments[0]?.id || null;
  }, [availableRoleAssignments, activeRoleAssignmentIdState]);

  const activeRoleAssignment = useMemo(() => 
    availableRoleAssignments.find(r => r.id === activeRoleAssignmentId) || null,
  [availableRoleAssignments, activeRoleAssignmentId]);

  const activeMemberProfile = useMemo(() => activeTenant?.memberProfile || null, [activeTenant]);

  const workspaceView = useMemo(() => {
    if (workspaceViewState === 'MEMBER' && activeMemberProfile) return 'MEMBER';
    if (workspaceViewState === 'STAFF' && activeRoleAssignment) return 'STAFF';
    // Fallback: prefer member if exists and no staff, otherwise staff
    if (activeMemberProfile && !activeRoleAssignment) return 'MEMBER';
    if (activeRoleAssignment) return 'STAFF';
    return workspaceViewState || 'STAFF';
  }, [workspaceViewState, activeMemberProfile, activeRoleAssignment]);

  const availableBranches = useMemo(() => {
    if (workspaceView === 'MEMBER') {
       if (activeMemberProfile) {
         // Create a synthetic BranchAccess for the member's branch to keep API simple
         return [{ branchId: activeMemberProfile.branchId, name: 'Member Branch' }];
       }
       return [];
    }
    return activeRoleAssignment?.branches || [];
  }, [workspaceView, activeMemberProfile, activeRoleAssignment]);
  
  const activeBranchId = useMemo(() => {
    if (activeBranchIdState && availableBranches.some(b => b.branchId === activeBranchIdState)) {
      return activeBranchIdState;
    }
    return availableBranches[0]?.branchId || null;
  }, [availableBranches, activeBranchIdState]);

  const activeBranch = useMemo(() => 
    availableBranches.find(b => b.branchId === activeBranchId) || null,
  [availableBranches, activeBranchId]);

  // Actions
  const setWorkspaceView = (view: WorkspaceView) => {
    setWorkspaceViewState(view);
    setActiveBranchIdState(null); // Reset branch on view change
  };

  const setActiveTenant = (tenantId: string) => {
    setActiveTenantIdState(tenantId);
    setActiveRoleAssignmentIdState(null);
    setActiveBranchIdState(null);
  };

  const setActiveRoleAssignment = (assignmentId: string) => {
    setActiveRoleAssignmentIdState(assignmentId);
    setActiveBranchIdState(null); // Reset branch on role change
  };

  const setActiveBranch = (branchId: string) => {
    setActiveBranchIdState(branchId);
  };

  return (
    <WorkspaceContext.Provider value={{
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
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within a WorkspaceProvider');
  return context;
};
