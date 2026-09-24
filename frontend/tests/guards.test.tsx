/// <reference types="jest" />
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth, RedirectToRoleDashboard } from '../src/routes/Guards';
import { ROLES } from '../src/types/roles';
import { useAuth } from '../src/contexts/AuthContext';

// Mock the AuthContext hook
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../src/contexts/WorkspaceContext', () => ({
  useWorkspace: jest.fn(),
  WorkspaceProvider: ({ children }: any) => <div>{children}</div>,
}));

const mockUseAuth = useAuth as jest.Mock;
import { useWorkspace } from '../src/contexts/WorkspaceContext';
const mockUseWorkspace = useWorkspace as jest.Mock;

describe('Route Guards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RequireAuth', () => {
    it('redirects to /auth/login if unauthenticated', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null });
      mockUseWorkspace.mockReturnValue({ activeRoleAssignment: null });
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
      mockUseAuth.mockReturnValue({ isAuthenticated: true, user: {} });
      mockUseWorkspace.mockReturnValue({ activeRoleAssignment: { role: ROLES.MEMBER } });
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

  // Legacy RequireRole was completely removed in F2 in favor of RequirePermission.
  describe('RedirectToRoleDashboard', () => {
    it('redirects owner to /reports', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: true, user: {} });
      mockUseWorkspace.mockReturnValue({ activeRoleAssignment: { role: ROLES.OWNER } });
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<RedirectToRoleDashboard />} />
            <Route path="/reports" element={<div data-testid="owner-dash">Owner Dash</div>} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByTestId('owner-dash')).toBeInTheDocument();
    });
  });
});
