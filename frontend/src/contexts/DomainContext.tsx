import { createContext, useContext, useState, ReactNode } from 'react';

export type DomainType = 'platform' | 'subdomain' | 'custom' | 'unknown';

export interface DomainConfig {
  type: DomainType;
  hostname: string;
  tenantSubdomain?: string;
  isDevelopment: boolean;
}

interface DomainContextType {
  domain: DomainConfig;
  isLoading: boolean;
  error: string | null;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export function resolveDomain(hostname: string): DomainConfig {
  const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost');
  
  // Platform domain (e.g. gymos.app)
  // For development, we treat 'localhost' as platform.
  // In production, VITE_PLATFORM_DOMAIN should be defined, defaulting to 'gymos.app'
  const platformDomain =
    (typeof process !== 'undefined' && process.env.VITE_PLATFORM_DOMAIN) || 'gymos.app';
  
  if (isDevelopment && (hostname === 'localhost' || hostname === '127.0.0.1')) {
    return { type: 'platform', hostname, isDevelopment };
  }
  
  if (hostname === platformDomain) {
    return { type: 'platform', hostname, isDevelopment };
  }

  // Tenant GymOS Subdomain (e.g. mygym.gymos.app or mygym.localhost)
  if (isDevelopment && hostname.endsWith('.localhost')) {
    const subdomain = hostname.replace('.localhost', '');
    return { type: 'subdomain', hostname, tenantSubdomain: subdomain, isDevelopment };
  }

  if (hostname.endsWith(`.${platformDomain}`)) {
    const subdomain = hostname.replace(`.${platformDomain}`, '');
    return { type: 'subdomain', hostname, tenantSubdomain: subdomain, isDevelopment };
  }

  // Otherwise, we consider it a custom domain.
  return { type: 'custom', hostname, isDevelopment };
}

export const DomainProvider = ({ children }: { children: ReactNode }) => {
  const [domain] = useState<DomainConfig>(() => resolveDomain(window.location.hostname));
  const [isLoading] = useState(false); // In the future, this might fetch from backend to verify custom domains
  const [error] = useState<string | null>(null);

  return (
    <DomainContext.Provider value={{ domain, isLoading, error }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomain = () => {
  const context = useContext(DomainContext);
  if (!context) throw new Error('useDomain must be used within a DomainProvider');
  return context;
};
