import React from 'react';
import { usePayments } from '../hooks/usePayments';
import { Payment } from '../types';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const MemberPaymentsList: React.FC = () => {
  const { data, isLoading, error, refetch } = usePayments(1);

  if (isLoading) return <LoadingState text="Loading billing history..." />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  const payments = data?.results || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing History</h2>
        <p className="text-muted-foreground mt-1">Review your past payments and transactions.</p>
      </div>

      {payments.length === 0 ? (
        <EmptyState title="No payments found" description="You have no recorded payments." />
      ) : (
        <div className="grid gap-4">
          {payments.map((payment: Payment) => (
            <Card key={payment.id}>
              <CardContent className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h4 className="font-semibold text-lg">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.currency || 'USD',
                    }).format(Number(payment.amount))}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Paid on {new Date(payment.paymentDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={payment.status === 'COMPLETED' ? 'default' : 'secondary'}>
                    {payment.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="uppercase">{payment.method}</span>
                    {payment.transactionId && <span>• {payment.transactionId}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
