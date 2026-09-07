import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types/api';

const api = axios.create({
  baseURL:
    typeof process !== 'undefined' && process.env.VITE_API_BASE_URL
      ? process.env.VITE_API_BASE_URL
      : '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// In-memory token storage to avoid localStorage security issues
let currentAccessToken: string | null = null;
let currentRefreshPromise: Promise<string> | null = null;

export const setAccessToken = (token: string | null) => {
  currentAccessToken = token;
};

export const getAccessToken = () => currentAccessToken;

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (currentAccessToken && config.headers) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized with Token Refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        if (!currentRefreshPromise) {
          currentRefreshPromise = axios
            .post<{ success: boolean; data: { token: string } }>(
              `${api.defaults.baseURL}/auth/refresh`,
              {},
              { withCredentials: true }
            )
            .then((res) => {
              setAccessToken(res.data.data.token);
              return res.data.data.token;
            })
            .finally(() => {
              currentRefreshPromise = null;
            });
        }

        const newToken = await currentRefreshPromise;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear state and dispatch a logout event so AuthContext can handle it
        setAccessToken(null);
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      }
    }

    // Error normalization to prevent sensitive backend leaks from reaching the UI
    if (error.response?.data?.error?.message) {
      const msg = error.response.data.error.message;
      const dangerousPatterns = [
        /java\.lang\./i,
        /Traceback \(most recent call/i,
        /org\.hibernate\./i,
        /\bSQLException\b/i,
        /SQL syntax.*?error/i,
        /at \//i,
      ];
      const isDangerous =
        dangerousPatterns.some((pattern) => pattern.test(msg)) || msg.length > 250;
      if (isDangerous) {
        error.response.data.error.message = 'An unexpected error occurred. Please contact support.';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
