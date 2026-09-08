/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { setAccessToken } from '@/services/api';

interface AuthState {
  isAuthenticated: boolean;
  user: null | { id: string; name: string; role: string; tenantId: string };
}

interface AuthContextType extends AuthState {
  login: (user: AuthState['user']) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const [authState, setAuthState] = useState<AuthState>(() => {
    const userStr = localStorage.getItem('user_data');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return { isAuthenticated: true, user };
      } catch (e) {
        console.warn('Failed to parse auth data:', e);
      }
    }
    return {
      isAuthenticated: false,
      user: null,
    };
  });

  const login = (user: AuthState['user']) => {
    localStorage.setItem('user_data', JSON.stringify(user));
    setAuthState({ isAuthenticated: true, user });
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('user_data');
    setAuthState({ isAuthenticated: false, user: null });
    queryClient.clear();
  };

  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
