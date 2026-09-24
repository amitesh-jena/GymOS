import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export type PaymentState = 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

interface PaymentStatusBadgeProps {
  status: PaymentState | string;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case 'PENDING':
      return <Badge variant="secondary" className="text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30">Pending</Badge>;
    case 'PROCESSING':
      return (
        <Badge variant="secondary" className="text-blue-600 bg-blue-100 dark:bg-blue-900/30 flex gap-1 items-center w-fit">
          <Loader2 className="w-3 h-3 animate-spin"/> Processing
        </Badge>
      );
    case 'SUCCESSFUL':
    case 'COMPLETED': // Account for existing backend mock state
      return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Successful</Badge>;
    case 'FAILED':
      return <Badge variant="destructive">Failed</Badge>;
    case 'REFUNDED':
      return <Badge variant="outline" className="border-gray-400 text-gray-500">Refunded</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
