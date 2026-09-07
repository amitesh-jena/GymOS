import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlans } from '../hooks/usePlans';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, FileEdit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function PlansList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError, refetch } = usePlans();

  if (isLoading) return <LoadingState text="Loading plans..." />;
  if (isError) return <ErrorState message="Failed to load plans." onRetry={() => refetch()} />;

  let plans = data?.results || [];

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    plans = plans.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Membership Plans</h2>
          <p className="text-muted-foreground mt-1">Configure plan templates and pricing.</p>
        </div>
        <Button onClick={() => navigate('/plans/new')} className="gap-2">
          <Plus className="h-4 w-4" /> Add Plan
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search plans by name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {plans.length === 0 ? (
            <div className="py-12 flex justify-center">
              <EmptyState
                title="No plans found"
                description="There are no membership plans matching your search."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow
                    key={plan.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/plans/${plan.id}/edit`)}
                  >
                    <TableCell>
                      <div className="font-medium text-foreground">{plan.name}</div>
                      <div className="text-xs text-muted-foreground">{plan.type}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{plan.durationDays} Days</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium capitalize">${plan.price}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.status === 'OPEN' ? 'default' : 'secondary'}>
                        {plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/plans/${plan.id}/edit`);
                        }}
                      >
                        <FileEdit className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Edit plan</span>
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
