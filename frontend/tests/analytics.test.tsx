import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AnalyticsDashboard } from '../src/features/analytics/components/AnalyticsDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from './server';
import { http, HttpResponse } from 'msw';

// ResizeObserver mock for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: 0 } },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('AnalyticsDashboard', () => {
  afterEach(() => {
    queryClient.clear();
  });

  it('renders overview KPIs properly after loading', async () => {
    renderWithProviders(<AnalyticsDashboard />);
    
    // Title
    expect(screen.getByText('Analytics & Reporting')).toBeInTheDocument();

    // Verify it resolves the data from MSW
    await waitFor(() => {
      // 405 total members is from the overview mock
      expect(screen.getByText('405')).toBeInTheDocument();
      // active memberships = 382
      expect(screen.getByText('382')).toBeInTheDocument();
      // revenue mock = $28,540.00
      expect(screen.getByText('$28,540.00')).toBeInTheDocument();
    });

    // Verify Date Range presence
    expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    // Override MSW to return an error
    server.use(
      http.get('/api/v1/analytics/overview', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithProviders(<AnalyticsDashboard />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Failed to load').length).toBeGreaterThan(0);
    });
  });
});
