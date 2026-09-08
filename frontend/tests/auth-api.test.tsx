import { authApi } from '../src/features/auth/api/auth';
import { handlers } from '../src/mocks/handlers';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

describe('Auth API', () => {
  it('calls login successfully', async () => {
    const res = await authApi.login({ email: 'super@gymos.com', password: 'password', roleHint: 'SUPER_ADMIN' });
    expect(res.token).toBeDefined();
    expect(res.user.role).toBe('SUPER_ADMIN');
  });

  it('calls logout successfully', async () => {
    await expect(authApi.logout()).resolves.toBeUndefined();
  });

  it('calls refresh successfully', async () => {
    server.use(
      http.post('/api/v1/auth/refresh', () => {
        return HttpResponse.json({ success: true, data: { token: 'new-token' } });
      })
    );
    const res = await authApi.refresh();
    expect(res.token).toBe('new-token');
  });

  it('calls passwordReset successfully', async () => {
    server.use(
      http.post('/api/v1/auth/password-reset', () => {
        return HttpResponse.json({ success: true, data: null });
      })
    );
    await expect(authApi.passwordReset('test@test.com')).resolves.toBeUndefined();
  });

  it('calls passwordResetConfirm successfully', async () => {
    server.use(
      http.post('/api/v1/auth/password-reset/confirm', () => {
        return HttpResponse.json({ success: true, data: null });
      })
    );
    await expect(authApi.passwordResetConfirm({ token: 'abc', password: 'new' })).resolves.toBeUndefined();
  });
});
