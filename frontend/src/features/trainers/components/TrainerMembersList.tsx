import React from 'react';
import { useMembers } from '@/features/members/hooks/useMembers';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export const TrainerMembersList: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useMembers({ trainerId: 'me' });

  if (isLoading) return <LoadingState text="Loading assigned members..." />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const members = data?.results || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">My Members</h2>
        <p className="text-muted-foreground mt-1">Clients assigned to you for coaching.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {members.length === 0 ? (
            <div className="py-12 flex justify-center">
              <EmptyState
                title="No members assigned"
                description="When members are assigned to you, they will appear here."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow
                    key={member.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/members/${member.id}`)}
                  >
                    <TableCell className="font-medium">
                      {member.firstName} {member.lastName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{member.email}</TableCell>
                    <TableCell>
                      <Badge variant={member.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
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
};
