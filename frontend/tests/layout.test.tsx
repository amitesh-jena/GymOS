import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { TenantProvider } from '@/contexts/TenantContext';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

describe('Layout Components', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <AuthProvider>
        <TenantProvider>
          <MemoryRouter>{ui}</MemoryRouter>
        </TenantProvider>
      </AuthProvider>
    );
  };

  it('renders AppShell', () => {
    const { unmount } = renderWithProviders(<AppShell />);
    expect(screen.getAllByText(/GymOS/i).length).toBeGreaterThan(0);
    unmount();
  });

  it('renders Header', () => {
    const { unmount } = renderWithProviders(<Header />);
    expect(screen.getByText(/US/i)).toBeInTheDocument();
    unmount();
  });

  it('renders Sidebar', () => {
    const { unmount } = renderWithProviders(<Sidebar />);
    expect(screen.getAllByText(/GymOS/i).length).toBeGreaterThan(0);
    unmount();
  });
});
