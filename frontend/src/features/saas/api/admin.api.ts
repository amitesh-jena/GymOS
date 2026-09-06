import api from '@/services/api';
import type { ApiResponse } from '@/types/api';
import { PlatformTenant, AdminTenantsFilter } from '../types';

export const getPlatformTenants = async (filters?: AdminTenantsFilter) => {
  const { data } = await api.get<ApiResponse<PlatformTenant[]>>('/admin/tenants', {
    params: filters,
  });
  return data.data;
};

export const getPlatformTenant = async (tenantId: string) => {
  const { data } = await api.get<ApiResponse<PlatformTenant>>(`/admin/tenants/${tenantId}`);
  return data.data;
};
