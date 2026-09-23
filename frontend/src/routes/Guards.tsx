import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { usePermissions } from '@/contexts/PermissionContext';
import { Role, ROLE_DEFAULT_DESTINATION } from '@/types/roles';
import { Permission } from '@/types/permissions';
import { LoadingState } from '@/components/ux/LoadingState';

export function RequireAuth() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}

export function RequireNoAuth() {
  const { isAuthenticated } = useAuth();
  const { activeRoleAssignment } = useWorkspace();

  if (isAuthenticated && activeRoleAssignment?.role) {
    const destination = ROLE_DEFAULT_DESTINATION[activeRoleAssignment.role as Role] || '/';
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}

export function RequirePermission({ permission, requireAll = false }: { permission: Permission | Permission[], requireAll?: boolean }) {
  const { user } = useAuth();
  const { hasAllPermissions, hasAnyPermission } = usePermissions();

  if (!user) {
    return <Navigate to="/403" replace />;
  }

  const permissions = Array.isArray(permission) ? permission : [permission];
  const hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);

  if (!hasAccess) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

export function RedirectToRoleDashboard() {
  const { isAuthenticated } = useAuth();
  const { activeRoleAssignment } = useWorkspace();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (activeRoleAssignment?.role) {
    const destination = ROLE_DEFAULT_DESTINATION[activeRoleAssignment.role as Role] || '/404';
    return <Navigate to={destination} replace />;
  }

  return <LoadingState text="Resolving session..." />;
}
