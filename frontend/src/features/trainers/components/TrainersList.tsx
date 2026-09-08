import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainers } from '../hooks/useTrainers';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export function TrainersList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError, refetch } = useTrainers();

  if (isLoading) return <LoadingState text="Loading trainers..." />;
  if (isError) return <ErrorState message="Failed to load trainers." onRetry={() => refetch()} />;

  let trainers = data?.results || [];

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    trainers = trainers.filter(
      (t) =>
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        (t.specialization && t.specialization.toLowerCase().includes(q))
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Trainers</h2>
          <p className="text-muted-foreground mt-1">Manage staff trainers and their specialties.</p>
        </div>
        <Button onClick={() => navigate('/trainers/new')} className="gap-2">
          <UserPlus className="h-4 w-4" /> Add Trainer
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search trainers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {trainers.length === 0 ? (
            <div className="py-12 flex justify-center">
              <EmptyState
                title="No trainers found"
                description="There are no trainers matching your search."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainers.map((trainer) => (
                  <TableRow
                    key={trainer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/trainers/${trainer.id}`)}
                  >
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {trainer.firstName} {trainer.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{trainer.email}</div>
                      <div className="text-xs text-muted-foreground">{trainer.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {trainer.specialization || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={trainer.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {trainer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trainers/${trainer.id}/edit`);
                        }}
                      >
                        <FileEdit className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Edit trainer</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trainers/${trainer.id}`);
                        }}
                      >
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">View trainer details</span>
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
