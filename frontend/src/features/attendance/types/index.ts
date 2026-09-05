export type AttendanceSource = 'MANUAL' | 'QR' | 'CARD';

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  branchId: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // ISO String
  checkOutTime?: string; // ISO String
  source: AttendanceSource;
  notes?: string;
}

export interface CheckInPayload {
  memberId: string;
  branchId: string;
  checkInTime: string;
  source: AttendanceSource;
  notes?: string;
}
