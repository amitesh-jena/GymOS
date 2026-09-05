import React, { useState } from 'react';
import { usePayments } from '../hooks/usePayments';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Plus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PaymentForm } from './PaymentForm';

export const PaymentsList: React.FC = () => {
  const page = 1;
  const [formOpen, setFormOpen] = useState(false);
  const { data, isLoading, error, refetch } = usePayments(page);

  if (isLoading) return <LoadingState text="Loading payments..." />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  const payments = data?.results || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Payments</h2>
          <p className="text-muted-foreground mt-1">Manage incoming member payments.</p>
        </div>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <PaymentForm onSuccess={() => setFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {payments.length === 0 ? (
        <EmptyState
          title="No payments found"
          description="Record your first payment to get started."
        />
      ) : (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Txn ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.memberName}</TableCell>
                  <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.currency,
                    }).format(Number(payment.amount))}
                  </TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === 'COMPLETED'
                          ? 'default'
                          : payment.status === 'FAILED'
                            ? 'destructive'
                            : 'secondary'
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.transactionId || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data && data.count > 10 && (
            <div className="p-4 border-t flex justify-center">
              
            </div>
          )}
        </div>
      )}
    </div>
  );
};
