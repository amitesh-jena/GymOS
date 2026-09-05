import { http, HttpResponse, delay } from 'msw';
import { AttendanceRecord, CheckInPayload } from '@/features/attendance/types';

let mockAttendance: AttendanceRecord[] = [
  {
    id: 'att-501',
    tenantId: 'gym-demo',
    branchId: 'branch-hk',
    memberId: 'mem-101',
    date: new Date().toISOString().split('T')[0],
    checkInTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    source: 'QR',
  },
];

export const attendanceHandlers = [
  http.get('/api/v1/attendance', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: {
        count: mockAttendance.length,
        next: null,
        previous: null,
        results: [...mockAttendance].reverse(), // newest first
      },
    });
  }),

  http.post('/api/v1/attendance/checkin', async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as CheckInPayload;

    // Check if recently checked in to prevent spam
    const recentlyCheckedIn = mockAttendance.find(
      (a) =>
        a.memberId === body.memberId &&
        a.date === new Date().toISOString().split('T')[0] &&
        !a.checkOutTime
    );

    if (recentlyCheckedIn) {
      return HttpResponse.json(
        {
          success: false,
          error: { code: 'ALREADY_CHECKED_IN', message: 'Member is already checked in.' },
        },
        { status: 400 }
      );
    }

    const newCheckIn: AttendanceRecord = {
      ...body,
      id: `att-${Math.floor(Math.random() * 10000)}`,
      tenantId: 'gym-demo',
      date: new Date().toISOString().split('T')[0],
    };
    mockAttendance.push(newCheckIn);
    return HttpResponse.json({ success: true, data: newCheckIn }, { status: 201 });
  }),
];
