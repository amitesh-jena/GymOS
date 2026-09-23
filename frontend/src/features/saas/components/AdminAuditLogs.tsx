import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const AdminAuditLogs: React.FC = () => {
  const MOCK_LOGS = [
    { id: '1', timestamp: '2026-09-23T14:32:00Z', actor: 'SysAdmin', action: 'TENANT_SUSPEND', resource: 'tenant: tnt-gym-003', target: 'Suspend applied due to payment failure' },
    { id: '2', timestamp: '2026-09-23T12:05:00Z', actor: 'BillingSystem', action: 'SUBSCRIPTION_RENEW', resource: 'tenant: tnt-gym-001', target: 'Successful payment processing' },
    { id: '3', timestamp: '2026-09-22T09:12:00Z', actor: 'Jane Smith', action: 'TENANT_CREATED', resource: 'tenant: tnt-gym-002', target: 'Provisioned with Starter plan' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">System Audit Logs</h2>
          <p className="text-muted-foreground mt-1">
            Global timeline of administrative activities.
          </p>
        </div>
      </div>

      <div className="bg-muted text-muted-foreground p-4 rounded-md text-sm">
        <strong>Note:</strong> Currently relying on mock data. Platform audit endpoint is not yet available in backend API.
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_LOGS.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline">{log.actor}</Badge></TableCell>
                    <TableCell><span className="font-mono text-sm font-semibold">{log.action}</span></TableCell>
                    <TableCell>{log.resource}</TableCell>
                    <TableCell className="text-muted-foreground">{log.target}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
