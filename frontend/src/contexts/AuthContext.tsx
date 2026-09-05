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
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  const login = (token: string, user: AuthState['user']) => {
    setAuthState({ isAuthenticated: true, user, token });
  };

  const logout = () => {
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
