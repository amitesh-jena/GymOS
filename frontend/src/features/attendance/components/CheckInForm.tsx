import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkInSchema, CheckInFormData } from '../schemas';
import { useCheckIn } from '../hooks/useAttendance';
import { useMembers } from '@/features/members/hooks/useMembers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { LoadingState } from '@/components/ux/LoadingState';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export function CheckInForm() {
  const navigate = useNavigate();

  const { data: membersObj, isLoading: isLoadingMembers } = useMembers(); // Fetch all members
  const checkInMutation = useCheckIn();

  const form = useForm<CheckInFormData>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      memberId: '',
      branchId: 'branch-hk',
      checkInTime: new Date().toISOString(),
      source: 'MANUAL',
      notes: '',
    },
  });

  const memberIdValue = useWatch({ control: form.control, name: 'memberId' });

  const onSubmit = async (values: CheckInFormData) => {
    // Inject current ISO timestamp at the moment of submission
    values.checkInTime = new Date().toISOString();
    await checkInMutation.mutateAsync(values);
    navigate('/attendance');
  };

  const isSaving = checkInMutation.isPending;

  if (isLoadingMembers) return <LoadingState text="Loading members directory..." />;
  const members = membersObj?.results || [];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/attendance')}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Manual Check-In</h2>
          <p className="text-sm text-muted-foreground">Register an entry for a member.</p>
        </div>
      </div>

      <Card>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="memberId">Select Member</Label>
              <Select
                value={memberIdValue}
                onValueChange={(val: string) => form.setValue('memberId', val)}
              >
                <SelectTrigger
                  id="memberId"
                  aria-invalid={!!form.formState.errors.memberId}
                  aria-describedby="memberId-error"
                >
                  <SelectValue placeholder="Search member..." />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} ({m.phone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.memberId && (
                <p id="memberId-error" className="text-xs text-destructive">
                  {form.formState.errors.memberId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Entry Type</Label>
              <Input id="source" value="MANUAL" disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={2}
                {...form.register('notes')}
                placeholder="Optional note for this entry."
                aria-invalid={!!form.formState.errors.notes}
                aria-describedby="source-error"
              />
              {form.formState.errors.notes && (
                <p id="notes-error" className="text-xs text-destructive">
                  {form.formState.errors.notes.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/attendance')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || !memberIdValue} className="gap-2">
                {isSaving ? (
                  'Processing...'
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" /> Check In Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
