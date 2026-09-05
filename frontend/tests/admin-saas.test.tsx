import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminTenantsList } from '../src/features/saas/components/AdminTenantsList';
import { AdminTenantDetail } from '../src/features/saas/components/AdminTenantDetail';
import { AuthProvider } from '../src/contexts/AuthContext';
import { server } from './server';
import { adminHandlers } from '../src/mocks/handlers/admin.handlers';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (ui: React.ReactElement, initialRoute = '/admin/tenants') => {
  const queryClient = createTestQueryClient();
  window.history.pushState({}, 'Test page', initialRoute);

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/admin/tenants" element={ui} />
            <Route path="/admin/tenants/:id" element={<AdminTenantDetail />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('SaaS Platform Admin (Phase 9)', () => {
  server.use(...adminHandlers);

  test('AdminTenantsList renders tenant data', async () => {
    renderWithProviders(<AdminTenantsList />);

    expect(screen.getByText('Platform Tenants')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Iron Temple Gym')).toBeInTheDocument();
      expect(screen.getByText('Cardio Kingdom')).toBeInTheDocument();
      expect(screen.getByText('arnold@irontemple.example.com')).toBeInTheDocument();
    });
  });

  test('AdminTenantDetail renders entitlement limits', async () => {
    renderWithProviders(<AdminTenantDetail />, '/admin/tenants/tnt-gym-001');

    await waitFor(() => {
      expect(screen.getByText('Iron Temple Gym')).toBeInTheDocument();
      // Validate we render entitlements section
      expect(screen.getByText('Plan Entitlements')).toBeInTheDocument();
      // Ensure we render the Max Branches limit
      expect(screen.getByText('Limit: 3')).toBeInTheDocument();
    });
  });
});
