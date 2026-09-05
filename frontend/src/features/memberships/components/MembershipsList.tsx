import { useNavigate } from 'react-router-dom';
import { useMemberships } from '../hooks/useMemberships';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileEdit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function MembershipsList() {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useMemberships();

  if (isLoading) return <LoadingState text="Loading memberships..." />;
  if (isError)
    return <ErrorState message="Failed to load memberships." onRetry={() => refetch()} />;

  let memberships = data?.results || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Memberships</h2>
          <p className="text-muted-foreground mt-1">Manage member assignments and subscriptions.</p>
        </div>
        <Button onClick={() => navigate('/memberships/assign')} className="gap-2">
          <Plus className="h-4 w-4" /> Assign Membership
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {memberships.length === 0 ? (
            <div className="py-12 flex justify-center">
              <EmptyState
                title="No active memberships"
                description="Assign a plan to a member to get started."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Plan ID</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberships.map((mshp) => (
                  <TableRow
                    key={mshp.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/memberships/${mshp.id}/edit`)}
                  >
                    <TableCell>
                      <div className="font-medium text-foreground">{mshp.memberId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{mshp.planId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(mshp.startDate).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(mshp.endDate).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          mshp.status === 'ACTIVE'
                            ? 'default'
                            : mshp.status === 'EXPIRED'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {mshp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/memberships/${mshp.id}/edit`);
                        }}
                      >
                        <FileEdit className="h-4 w-4 text-muted-foreground" />
                      </Button>
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
