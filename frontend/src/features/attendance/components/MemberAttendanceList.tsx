import React from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Card, CardContent } from '@/components/ui/card';

export const MemberAttendanceList: React.FC = () => {
  const { data, isLoading, error, refetch } = useAttendance();

  if (isLoading) return <LoadingState text="Loading attendance history..." />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  const records = data?.results || [];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Check-in History</h2>
        <p className="text-muted-foreground mt-1">Review your gym visits.</p>
      </div>

      {records.length === 0 ? (
        <EmptyState
          title="No check-ins yet"
          description="Scan your card at the desk to record your visits."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="p-4 flex justify-between items-center hover:bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full flex flex-col items-center justify-center min-w-16">
                      <span className="text-xs font-semibold uppercase">
                        {new Date(record.checkInTime).toLocaleDateString(undefined, {
                          month: 'short',
                        })}
                      </span>
                      <span className="text-xl font-bold leading-none mt-1">
                        {new Date(record.checkInTime).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-lg">
                        {new Date(record.checkInTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {record.checkOutTime && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Checkout:{' '}
                          {new Date(record.checkOutTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
