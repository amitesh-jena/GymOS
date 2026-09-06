import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, LoginPayload } from '../api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { setAccessToken } from '@/services/api';

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAccessToken(data.token);
      login(data.user);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      setAccessToken(null);
      logout();
      queryClient.clear();
    },
  });
};
