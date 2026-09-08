import api from '@/services/api';
import type { ApiResponse } from '@/types/api';
import { PlatformTenant, AdminTenantsFilter } from '../types';

export const getPlatformTenants = async (filters?: AdminTenantsFilter) => {
  const { data } = await api.get<ApiResponse<PlatformTenant[]>>('/gyms', {
    params: filters,
  });
  return data.data;
};

export const getPlatformTenant = async (tenantId: string) => {
  const { data } = await api.get<ApiResponse<PlatformTenant>>(`/gyms/${tenantId}`);
  return data.data;
};

export const updateTenantStatus = async (tenantId: string, status: 'ACTIVE' | 'SUSPENDED') => {
  if (status === 'SUSPENDED') {
    const { data } = await api.post<ApiResponse<PlatformTenant>>(`/gyms/${tenantId}/suspend`);
    return data.data;
  }
  const { data } = await api.patch<ApiResponse<PlatformTenant>>(`/gyms/${tenantId}`, { status });
  return data.data;
};
