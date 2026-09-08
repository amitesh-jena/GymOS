/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from 'react';

interface TenantContextType {
  tenantId: string | null;
  branchId: string | null;
  setTenant: (tenantId: string | null) => void;
  setBranch: (branchId: string | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [tenantId, setTenant] = useState<string | null>(null);
  const [branchId, setBranch] = useState<string | null>(null);

  return (
    <TenantContext.Provider value={{ tenantId, branchId, setTenant, setBranch }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant must be used within a TenantProvider');
  return context;
};
