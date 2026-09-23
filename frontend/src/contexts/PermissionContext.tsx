import { createContext, useContext, useMemo, ReactNode } from 'react';
import { useWorkspace } from './WorkspaceContext';
import { Permission, ROLE_PERMISSIONS } from '@/types/permissions';
import { ROLES, Role } from '@/types/roles';

interface PermissionContextType {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const { activeTenant, activeBranch } = useWorkspace();

  const effectivePermissions = useMemo(() => {
    const permissions = new Set<Permission>();

    if (!activeTenant) return permissions;

    const branchId = activeBranch?.branchId;

    // 1. Evaluate Member Profile for this tenant/branch
    if (activeTenant.memberProfile) {
      if (!branchId || activeTenant.memberProfile.branchId === branchId) {
        (ROLE_PERMISSIONS[ROLES.MEMBER] || []).forEach(p => permissions.add(p));
      }
    }

    // 2. Evaluate Staff Roles for this tenant/branch
    if (activeTenant.staffProfile?.roleAssignments) {
      activeTenant.staffProfile.roleAssignments.forEach(assignment => {
        let isApplicable = false;
        
        if (assignment.role === ROLES.SUPER_ADMIN || assignment.role === ROLES.OWNER) {
          isApplicable = true; // Tenant-wide full power
        } else if (!branchId) {
           // If no branch is active, only global roles apply (already handled above)
           // But if we want gracefully falling back if they have roles, we check if they have the branch.
           isApplicable = false;
        } else if (assignment.branches.some(b => b.branchId === branchId)) {
          isApplicable = true;
        }

        if (isApplicable) {
          const rolePerms = ROLE_PERMISSIONS[assignment.role as Role] || [];
          rolePerms.forEach(p => permissions.add(p));
        }
      });
    }

    return permissions;
  }, [activeTenant, activeBranch]);

  const hasPermission = (permission: Permission) => effectivePermissions.has(permission);
  const hasAnyPermission = (permissions: Permission[]) => permissions.some(p => hasPermission(p));
  const hasAllPermissions = (permissions: Permission[]) => permissions.every(p => hasPermission(p));

  return (
    <PermissionContext.Provider value={{
      hasPermission,
      hasAnyPermission,
      hasAllPermissions
    }}>
      {children}
    </PermissionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) throw new Error('usePermissions must be used within a PermissionProvider');
  return context;
};
