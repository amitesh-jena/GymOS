import React from 'react';
import { useInvoices } from '../hooks/useInvoices';
import { Invoice } from '../types';
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

export const InvoicesList: React.FC = () => {
  const page = 1;
  const { data, isLoading, error, refetch } = useInvoices(page);

  if (isLoading) return <LoadingState text="Loading invoices..." />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  const invoices = data?.results || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Invoices</h2>
        <p className="text-muted-foreground mt-1">View billing statements and invoices.</p>
      </div>

      {invoices.length === 0 ? (
        <EmptyState title="No invoices found" description="No invoices have been generated yet." />
      ) : (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice: Invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-sm">{invoice.id.split('-')[0]}</TableCell>
                  <TableCell className="font-medium">{invoice.memberName}</TableCell>
                  <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      Number(invoice.total)
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === 'PAID'
                          ? 'default'
                          : invoice.status === 'OVERDUE'
                            ? 'destructive'
                            : invoice.status === 'DRAFT'
                              ? 'outline'
                              : 'secondary'
                      }
                    >
                      {invoice.status}
                    </Badge>
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
