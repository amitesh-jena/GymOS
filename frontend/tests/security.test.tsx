import React from 'react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, act } from '@testing-library/react';
import api, { setAccessToken, getAccessToken } from '../src/services/api';
import { server } from './server';
import { http, HttpResponse } from 'msw';
import { AxiosError } from 'axios';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Security: Error Normalization & Refresh', () => {
  beforeEach(() => {
    setAccessToken(null);
  });

  it('sanitizes dangerous stack traces in API errors (Java)', async () => {
    server.use(
      http.get('*/api/v1/test-error-java', () => {
        return HttpResponse.json(
          {
            success: false,
            error: {
              code: 'INTERNAL',
              message: 'java.lang.NullPointerException at com.gymos.service',
            },
          },
          { status: 500 }
        );
      })
    );

    let caughtError: AxiosError | null = null;
    try {
      await api.get('/test-error-java');
    } catch (err: any) {
      caughtError = err;
    }

    expect(caughtError).toBeTruthy();
    const data = caughtError?.response?.data as any;
    expect(data?.error?.message).toBe('An unexpected error occurred. Please contact support.');
  });

  it('sanitizes oversized backend error payloads', async () => {
    const hugeMessage = 'A'.repeat(300);
    server.use(
      http.get('*/api/v1/test-error-oversized', () => {
        return HttpResponse.json(
          {
            success: false,
            error: {
              code: 'INTERNAL',
              message: hugeMessage,
            },
          },
          { status: 500 }
        );
      })
    );

    let caughtError: AxiosError | null = null;
    try {
      await api.get('/test-error-oversized');
    } catch (err: any) {
      caughtError = err;
    }

    expect(caughtError).toBeTruthy();
    const data = caughtError?.response?.data as any;
    expect(data?.error?.message).toBe('An unexpected error occurred. Please contact support.');
  });

  it('preserves legitimate validation message containing a potentially sensitive-looking ordinary word', async () => {
    // Tests that we don't blindly censor 'exception' or 'SQL'
    server.use(
      http.get('*/api/v1/test-safe-error', () => {
        return HttpResponse.json(
          {
            success: false,
            error: {
              code: 'BAD_REQUEST',
              message: 'An exception occurred in your billing cycle. Please update payment method.',
            },
          },
          { status: 400 }
        );
      })
    );

    let caughtError: AxiosError | null = null;
    try {
      await api.get('/test-safe-error');
    } catch (err: any) {
      caughtError = err;
    }

    expect(caughtError).toBeTruthy();
    const data = caughtError?.response?.data as any;
    expect(data?.error?.message).toBe(
      'An exception occurred in your billing cycle. Please update payment method.'
    );
  });
});

describe('Security: AuthContext Logout', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    localStorage.clear();
    setAccessToken(null);
  });

  it('normal logout clears the in-memory access token and queryClient cache', async () => {
    setAccessToken('fake-in-memory-token');
    localStorage.setItem(
      'user_data',
      JSON.stringify({ id: '1', name: 'Test', role: 'ADMIN', tenantId: '1' })
    );

    // Seed query cache
    queryClient.setQueryData(['test-key'], { sensitive: 'data' });
    expect(queryClient.getQueryData(['test-key'])).toBeDefined();

    const TestComponent = () => {
      const { logout } = useAuth();
      return <button onClick={logout}>Logout</button>;
    };

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>
    );

    expect(getAccessToken()).toBe('fake-in-memory-token');
    expect(localStorage.getItem('user_data')).toBeTruthy();

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem('user_data')).toBeNull();
    expect(queryClient.getQueryData(['test-key'])).toBeUndefined(); // Cache was cleared
  });
});
