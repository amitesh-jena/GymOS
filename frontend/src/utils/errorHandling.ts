import { AxiosError } from 'axios';
import { ApiError } from '@/types/api';

export function getApiErrorMessage(
  error: unknown,
  defaultMessage = 'An unexpected error occurred'
): string {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.error?.message) {
      return axiosError.response.data.error.message;
    }
  }
  if (error instanceof Error) return error.message;
  return defaultMessage;
}

export function applyServerValidationErrors(
  error: unknown,
  setError: (field: string, error: { type: string; message: string }) => void
): boolean {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<ApiError>;
    const apiError = axiosError.response?.data?.error;

    if (apiError?.code === 'VALIDATION_ERROR' && apiError.details) {
      Object.entries(apiError.details).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          setError(field, { type: 'server', message: messages.join(', ') });
        }
      });
      return true;
    }
  }
  return false;
}
