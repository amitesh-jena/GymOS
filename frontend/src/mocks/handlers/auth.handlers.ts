import { http, HttpResponse } from 'msw';
import { AuthResponse } from '@/features/auth/api/auth';
import { ROLES } from '@/types/roles';

export const authHandlers = [
  http.post('/api/v1/auth/login', async ({ request }) => {
    const payload = (await request.json()) as Record<string, string>;

    // Simulate finding a user
    const userRole = payload.roleHint || ROLES.MEMBER;
    const nameMap: Record<string, string> = {
      [ROLES.SUPER_ADMIN]: 'Super Admin',
      [ROLES.OWNER]: 'Gym Owner',
      [ROLES.BRANCH_MANAGER]: 'Branch Manager',
      [ROLES.RECEPTIONIST]: 'Receptionist',
      [ROLES.TRAINER]: 'Trainer',
      [ROLES.MEMBER]: 'Member',
    };

    const authRes: AuthResponse = {
      token: 'mock-access-token-12345',
      user: {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        name: `Mock ${nameMap[userRole] || 'User'}`,
        role: userRole,
        tenantId: 'tnt-gym-001',
      },
    };

    return HttpResponse.json(
      { success: true, data: authRes },
      {
        headers: {
          'Set-Cookie': `refresh_token=mock-refresh-token-xyz; Path=/; HttpOnly; SameSite=Lax`,
        },
      }
    );
  }),

  http.post('/api/v1/auth/refresh', () => {
    // If we wanted to check cookies in a real MSW setup we could inspect request.headers.get('cookie')
    return HttpResponse.json({ success: true, data: { token: 'mock-access-token-refreshed' } });
  }),

  http.post('/api/v1/auth/logout', () => {
    return HttpResponse.json(
      { success: true },
      {
        headers: {
          'Set-Cookie': `refresh_token=; Path=/; HttpOnly; Max-Age=0`,
        },
      }
    );
  }),

  http.post('/api/v1/auth/password-reset', () => {
    return HttpResponse.json({ success: true, message: 'Reset link sent' });
  }),

  http.post('/api/v1/auth/password-reset/confirm', () => {
    return HttpResponse.json({ success: true, message: 'Password updated' });
  }),
];
