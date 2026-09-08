import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../hooks/useAttendance';
import { useMembers } from '@/features/members/hooks/useMembers';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function AttendanceList() {
  const navigate = useNavigate();

  const { data: attendanceObj, isLoading, isError, refetch } = useAttendance();
  const { data: membersObj, isLoading: isLoadingMembers } = useMembers();

  if (isLoading || isLoadingMembers) return <LoadingState text="Loading attendance logs..." />;
  if (isError)
    return <ErrorState message="Failed to load attendance logs." onRetry={() => refetch()} />;

  let records = attendanceObj?.results || [];
  const members = membersObj?.results || [];

  const getMemberName = (id: string) => {
    const mem = members.find((m) => m.id === id);
    return mem ? `${mem.firstName} ${mem.lastName}` : id;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Attendance</h2>
          <p className="text-muted-foreground mt-1">Review member check-ins and history.</p>
        </div>
        <Button onClick={() => navigate('/attendance/checkin')} className="gap-2">
          <Plus className="h-4 w-4" /> Manual Check-in
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {records.length === 0 ? (
            <div className="py-12 flex justify-center">
              <EmptyState
                title="No attendance records"
                description="Monitor the gates to see activity today."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check-In Time</TableHead>
                  <TableHead>Check-Out Time</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {getMemberName(record.memberId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{record.date}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {new Date(record.checkInTime).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {record.checkOutTime
                          ? new Date(record.checkOutTime).toLocaleTimeString()
                          : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.source}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
