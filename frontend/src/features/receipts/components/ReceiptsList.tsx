import React from 'react';
import { useReceipts } from '../hooks/useReceipts';
import { Receipt } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';

export const ReceiptsList: React.FC = () => {
  const page = 1;
  const { data, isLoading, error, refetch } = useReceipts(page);

  if (isLoading) return <LoadingState text="Loading receipts..." />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  const receipts = data?.results || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Receipts</h2>
        <p className="text-muted-foreground mt-1">Payment receipts and transaction proofs.</p>
      </div>

      {receipts.length === 0 ? (
        <EmptyState title="No receipts found" description="No receipts have been generated yet." />
      ) : (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt ID</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Ref</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt: Receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-mono text-sm">{receipt.id.split('-')[0]}</TableCell>
                  <TableCell className="font-medium">{receipt.memberName}</TableCell>
                  <TableCell>{new Date(receipt.receiptDate).toLocaleDateString()}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {receipt.paymentId.split('-')[0]}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      Number(receipt.amount)
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data && data.count > 10 && <div className="p-4 border-t flex justify-center"></div>}
        </div>
      )}
    </div>
  );
};
