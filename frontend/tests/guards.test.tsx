/// <reference types="jest" />
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth, RequireRole, RedirectToRoleDashboard } from '../src/routes/Guards';
import { ROLES } from '../src/types/roles';
import { useAuth } from '../src/contexts/AuthContext';

// Mock the AuthContext hook
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: any) => <div>{children}</div>
}));

const mockUseAuth = useAuth as jest.Mock;

describe('Route Guards', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RequireAuth', () => {
    it('redirects to /auth/login if unauthenticated', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null });
      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<RequireAuth />}>
              <Route path="/protected" element={<div data-testid="protected">Protected</div>} />
            </Route>
            <Route path="/auth/login" element={<div data-testid="login">Login</div>} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByTestId('login')).toBeInTheDocument();
      expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
    });

    it('renders outlet if authenticated', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { role: ROLES.MEMBER } });
      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<RequireAuth />}>
              <Route path="/protected" element={<div data-testid="protected">Protected</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected')).toBeInTheDocument();
    });
  });

  describe('RequireRole', () => {
    it('redirects to 403 if role is not allowed', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { role: ROLES.MEMBER } });
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route element={<RequireRole allowedRoles={[ROLES.OWNER]} />}>
              <Route path="/admin" element={<div data-testid="admin">Admin</div>} />
            </Route>
            <Route path="/403" element={<div data-testid="403">Forbidden</div>} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByTestId('403')).toBeInTheDocument();
      expect(screen.queryByTestId('admin')).not.toBeInTheDocument();
    });
  });

  describe('RedirectToRoleDashboard', () => {
    it('redirects owner to /dashboard', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { role: ROLES.OWNER } });
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<RedirectToRoleDashboard />} />
            <Route path="/dashboard" element={<div data-testid="owner-dash">Owner Dash</div>} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByTestId('owner-dash')).toBeInTheDocument();
    });
  });
});
