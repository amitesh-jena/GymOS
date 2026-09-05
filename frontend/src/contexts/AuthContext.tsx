/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  user: null | { id: string; name: string; role: string; tenantId: string };
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, user: AuthState['user']) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_data');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        return { isAuthenticated: true, user, token };
      } catch (e) {
        console.warn('Failed to parse auth data:', e);
      }
    }
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  });

  const login = (token: string, user: AuthState['user']) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    setAuthState({ isAuthenticated: true, user, token });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setAuthState({ isAuthenticated: false, user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
