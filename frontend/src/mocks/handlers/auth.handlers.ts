import { http, HttpResponse } from 'msw';
import { AuthResponse } from '@/features/auth/api/auth';
import { ROLES, Role } from '@/types/roles';
import { User, TenantRelationship } from '@/types/identity';

export const authHandlers = [
  http.post('/api/v1/auth/login', async ({ request }) => {
    const payload = (await request.clone().json()) as Record<string, string>;

    // Simulate finding a user
    const userRole = (payload.roleHint as Role) || ROLES.MEMBER;
    
    // Simulate F1A identity model
    let authUser: Omit<User, 'tenants'> & { tenants: TenantRelationship[] } = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      name: `Mock ${userRole}`,
      email: payload.email,
      tenants: [
        {
          tenantId: 'tnt-gym-001',
          tenantName: 'Gym C',
          staffProfile: {
            id: 'staff-001',
            roleAssignments: [
              {
                id: 'assignment-001',
                role: userRole,
                branches: [{ branchId: 'branch-1', name: 'Branch 1' }]
              }
            ]
          },
          memberProfile: { id: 'member-001', branchId: 'branch-1' }
        }
      ]
    };

    // F1A complex user scenario: Trainer + Member at exactly "Gym C"
    if (payload.email === 'rahul@gymc.local') {
      authUser = {
        id: 'usr-rahul-001',
        name: 'Rahul',
        email: 'rahul@gymc.local',
        tenants: [
          {
            tenantId: 'tnt-gymc',
            tenantName: 'Gym C',
            staffProfile: {
              id: 'staff-rahul',
              roleAssignments: [
                {
                  id: 'assignment-trainer',
                  role: ROLES.TRAINER,
                  branches: [{ branchId: 'branch-1', name: 'Branch 1' }]
                },
                {
                  id: 'assignment-manager',
                  role: ROLES.BRANCH_MANAGER,
                  branches: [
                    { branchId: 'branch-1', name: 'Branch 1' },
                    { branchId: 'branch-2', name: 'Branch 2' }
                  ]
                }
              ]
            },
            memberProfile: { 
              id: 'member-rahul',
              branchId: 'branch-1' 
            }
          },
          {
            // Second tenant relationship exactly as requested
            tenantId: 'tnt-gymd',
            tenantName: 'Gym D',
            staffProfile: {
              id: 'staff-rahul-d',
              roleAssignments: [
                {
                  id: 'assignment-trainer-d',
                  role: ROLES.TRAINER,
                  branches: [{ branchId: 'branch-3', name: 'Branch 3' }]
                }
              ]
            }
          }
        ]
      };
    }

    const authRes: AuthResponse = {
      token: 'mock-access-token-12345',
      user: authUser as unknown as User,
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
