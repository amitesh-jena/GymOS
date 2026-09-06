import api from '@/services/api';
import type { ApiResponse, PaginatedData } from '@/types/api';
import { AttendanceRecord, CheckInPayload } from '../types';

export const attendanceApi = {
  getAttendance: async (
    params?: Record<string, string>
  ): Promise<PaginatedData<AttendanceRecord>> => {
    const response = await api.get<ApiResponse<PaginatedData<AttendanceRecord>>>('/attendance', {
      params,
    });
    return response.data.data;
  },

  checkIn: async (payload: CheckInPayload): Promise<AttendanceRecord> => {
    const response = await api.post<ApiResponse<AttendanceRecord>>('/attendance/checkin', payload);
    return response.data.data;
  },
};
