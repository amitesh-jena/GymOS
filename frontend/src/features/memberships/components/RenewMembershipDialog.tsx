import React, { useState } from 'react';
import { useRenewMembership } from '../hooks/useMemberships';
import { usePlans } from '@/features/plans/hooks/usePlans';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const RenewMembershipDialog: React.FC<{
  membershipId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ membershipId, open, onOpenChange }) => {
  const [planId, setPlanId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const { data: plansData } = usePlans();
  const renewMut = useRenewMembership(membershipId);

  const handleRenew = async () => {
    if (!planId || !startDate || !endDate) return;
    await renewMut.mutateAsync({ planId, startDate, endDate });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renew Membership</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Plan" />
              </SelectTrigger>
              <SelectContent>
                {plansData?.results.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} - {p.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="flex justify-end pt-4 gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={renewMut.isPending || !planId} onClick={handleRenew}>
              {renewMut.isPending ? 'Renewing...' : 'Confirm Renewal'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
