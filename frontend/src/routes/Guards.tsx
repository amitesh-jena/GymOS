import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role, ROLE_DEFAULT_DESTINATION } from '@/types/roles';
import { LoadingState } from '@/components/ux/LoadingState';

export function RequireAuth() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}

export function RequireNoAuth() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user?.role) {
    const destination = ROLE_DEFAULT_DESTINATION[user.role as Role] || '/';
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}

export function RequireRole({ allowedRoles }: { allowedRoles: Role[] }) {
  const { user } = useAuth();

  if (!user || !user.role) {
    return <Navigate to="/403" replace />;
  }

  if (!allowedRoles.includes(user.role as Role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

export function RedirectToRoleDashboard() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user?.role) {
    const destination = ROLE_DEFAULT_DESTINATION[user.role as Role] || '/404';
    return <Navigate to={destination} replace />;
  }

  return <LoadingState text="Resolving session..." />;
}
