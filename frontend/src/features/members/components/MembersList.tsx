import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembers } from '../hooks/useMembers';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, FileEdit, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function MembersList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data, isLoading, isError, refetch } = useMembers();

  if (isLoading) return <LoadingState text="Loading members..." />;
  if (isError) return <ErrorState message="Failed to load members." onRetry={() => refetch()} />;

  let members = data?.results || [];

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    members = members.filter(
      (m) =>
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
    );
  }

  if (statusFilter !== 'all') {
    members = members.filter((m) => m.status === statusFilter);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Members</h2>
          <p className="text-muted-foreground mt-1">Manage gym members and their status.</p>
        </div>
        <Button onClick={() => navigate('/members/new')} className="gap-2">
          <UserPlus className="h-4 w-4" /> Add Member
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="FROZEN">Frozen</SelectItem>
            <SelectItem value="LEAD">Lead</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {members.length === 0 ? (
            <div className="py-12 flex justify-center">
              <EmptyState
                title="No members found"
                description="There are no members matching your current filters."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow
                    key={member.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/members/${member.id}`)}
                  >
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {member.firstName} {member.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                      <div className="text-xs text-muted-foreground">{member.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.status === 'ACTIVE'
                            ? 'default'
                            : member.status === 'LEAD'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/members/${member.id}/edit`);
                        }}
                      >
                        <FileEdit className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Edit member</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/members/${member.id}`);
                        }}
                      >
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">View member details</span>
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
