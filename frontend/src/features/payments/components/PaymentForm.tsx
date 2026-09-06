import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema, PaymentFormData } from '../schemas';
import { useCreatePayment } from '../hooks/usePayments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useMembers } from '@/features/members/hooks/useMembers';

export const PaymentForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const createMutation = useCreatePayment();
  const { data: membersData } = useMembers();

  const [todaysDate] = useState(new Date().toISOString().split('T')[0]);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      memberId: '',
      membershipId: '',
      amount: '',
      currency: 'USD',
      method: 'CASH',
      transactionId: '',
      paymentDate: todaysDate || new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const memberIdVal = useWatch({ control: form.control, name: 'memberId' });
  const methodVal = useWatch({ control: form.control, name: 'method' });

  const onSubmit = async (data: PaymentFormData) => {
    try {
      await createMutation.mutateAsync(data);
      onSuccess();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="memberId">Member</Label>
          <Select value={memberIdVal} onValueChange={(val) => form.setValue('memberId', val)}>
            <SelectTrigger id="memberId">
              <SelectValue placeholder="Select member" />
            </SelectTrigger>
            <SelectContent>
              {membersData?.results.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.firstName} {m.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.memberId && (
            <p className="text-sm text-destructive">{form.formState.errors.memberId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (USD)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...form.register('amount')}
          />
          {form.formState.errors.amount && (
            <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="method">Payment Method</Label>
          <Select
            value={methodVal}
            onValueChange={(val: 'CASH' | 'UPI' | 'CARD' | 'ONLINE') =>
              form.setValue('method', val)
            }
          >
            <SelectTrigger id="method">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">Cash</SelectItem>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="CARD">Card</SelectItem>
              <SelectItem value="ONLINE">Online Portal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
          <Input id="transactionId" placeholder="Txn ID" {...form.register('transactionId')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentDate">Payment Date</Label>
          <Input id="paymentDate" type="date" {...form.register('paymentDate')} />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Processing...' : 'Record Payment'}
        </Button>
      </div>
    </form>
  );
};
