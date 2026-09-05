import { useQuery } from '@tanstack/react-query';
import { getPlatformTenants, getPlatformTenant } from '../api/admin.api';
import { AdminTenantsFilter } from '../types';

export const usePlatformTenants = (filters?: AdminTenantsFilter) => {
  return useQuery({
    queryKey: ['admin', 'tenants', filters],
    queryFn: () => getPlatformTenants(filters),
  });
};

export const usePlatformTenant = (tenantId: string) => {
  return useQuery({
    queryKey: ['admin', 'tenants', tenantId],
    queryFn: () => getPlatformTenant(tenantId),
    enabled: !!tenantId,
  });
};
