import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PaymentForm } from './PaymentForm';

interface PaymentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaymentFormDialog: React.FC<PaymentFormDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
          <DialogDescription className="sr-only">
            Record a new payment transaction
          </DialogDescription>
        </DialogHeader>
        <PaymentForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
