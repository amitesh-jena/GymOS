import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlatformTenants, getPlatformTenant, updateTenantStatus } from '../api/admin.api';
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

export const useUpdateTenantStatus = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: 'ACTIVE' | 'SUSPENDED') => updateTenantStatus(tenantId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] });
    },
  });
};
