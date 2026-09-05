import { http, HttpResponse } from 'msw';

import { membersHandlers } from './handlers/members.handlers';
import { trainersHandlers } from './handlers/trainers.handlers';
import { plansHandlers } from './handlers/plans.handlers';
import { membershipsHandlers } from './handlers/memberships.handlers';
import { attendanceHandlers } from './handlers/attendance.handlers';
import { paymentsHandlers } from './handlers/payments.handlers';
import { invoicesHandlers } from './handlers/invoices.handlers';
import { receiptsHandlers } from './handlers/receipts.handlers';

export const handlers = [
  ...membersHandlers,
  ...trainersHandlers,
  ...plansHandlers,
  ...membershipsHandlers,
  ...attendanceHandlers,
  ...paymentsHandlers,
  ...invoicesHandlers,
  ...receiptsHandlers,
  http.get('/api/v1/health', () => {
    return HttpResponse.json({
      success: true,
      message: 'Health check passed',
      data: { status: 'ok' },
    });
  }),
];
