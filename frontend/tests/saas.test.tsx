import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SubscriptionSettingsView } from '../src/features/saas/components/SubscriptionSettingsView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from './server';
import { http, HttpResponse } from 'msw';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe('SaaS SubscriptionSettingsView', () => {
  afterEach(() => {
    queryClient.clear();
  });

  it('renders loading state initially', () => {
    renderWithProviders(<SubscriptionSettingsView />);
    expect(screen.getByText(/Loading subscription details.../i)).toBeInTheDocument();
  });

  it('renders subscription details and available plans successfully', async () => {
    renderWithProviders(<SubscriptionSettingsView />);

    await waitFor(() => {
      expect(screen.getByText('SaaS Subscription')).toBeInTheDocument();
    });

    // Check current status section
    expect(screen.getByText('Current Status')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument(); // The badge for status
    expect(screen.getAllByText('Professional').length).toBeGreaterThan(0); // Active Plan
    
    // Check available plans section
    expect(screen.getByText('Available Plans')).toBeInTheDocument();
    expect(screen.getAllByText('Starter').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Enterprise').length).toBeGreaterThan(0);
  });

  it('renders error state on API failure', async () => {
    server.use(
      http.get('/api/v1/subscriptions/current', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithProviders(<SubscriptionSettingsView />);

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });
});
