import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { membershipSchema, MembershipFormData } from '../schemas';
import { useMembership, useCreateMembership, useUpdateMembership } from '../hooks/useMemberships';
import { useMembers } from '@/features/members/hooks/useMembers';
import { usePlans } from '@/features/plans/hooks/usePlans';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { ArrowLeft, Save } from 'lucide-react';

const getDefaultValues = (): Partial<MembershipFormData> => ({
  memberId: '',
  planId: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'ACTIVE',
});

export function MembershipForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const {
    data: membership,
    isLoading: isLoadingMshp,
    isError: isErrorMshp,
    refetch,
  } = useMembership(id || '');
  const { data: membersObj, isLoading: isLoadingMembers } = useMembers(); // Fetch all members
  const { data: plansObj, isLoading: isLoadingPlans } = usePlans(); // Fetch all plans

  const createMutation = useCreateMembership();
  const updateMutation = useUpdateMembership(id || '');

  const form = useForm<MembershipFormData>({
    resolver: zodResolver(membershipSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (isEdit && membership) {
      form.reset({
        memberId: membership.memberId,
        planId: membership.planId,
        startDate: membership.startDate.split('T')[0],
        endDate: membership.endDate.split('T')[0],
        status: membership.status,
      });
    }
  }, [isEdit, membership, form]);

  const memberIdValue = useWatch({ control: form.control, name: 'memberId' });
  const planIdValue = useWatch({ control: form.control, name: 'planId' });
  const statusValue = useWatch({ control: form.control, name: 'status' });

  const onSubmit = async (values: MembershipFormData) => {
    if (isEdit) {
      await updateMutation.mutateAsync(values);
    } else {
      await createMutation.mutateAsync(values);
    }
    if (mounted.current) {
      navigate('/memberships');
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if ((isEdit && isLoadingMshp) || isLoadingMembers || isLoadingPlans)
    return <LoadingState text="Loading..." />;
  if (isEdit && (isErrorMshp || !membership))
    return <ErrorState message="Failed to load membership." onRetry={() => refetch()} />;

  const members = membersObj?.results || [];
  const plans = plansObj?.results || [];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/memberships')}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to memberships</span>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            {isEdit ? 'Update Membership' : 'Assign Membership'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Bind a plan to a member and set the active window.
          </p>
        </div>
      </div>

      <Card>
        {/* eslint-disable-next-line react-hooks/refs */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="memberId">Member</Label>
                <Select
                  value={memberIdValue}
                  onValueChange={(val: string) => form.setValue('memberId', val)}
                >
                  <SelectTrigger
                    id="memberId"
                    aria-invalid={!!form.formState.errors.memberId}
                    aria-describedby="memberId-error"
                  >
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.firstName} {m.lastName}
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
                <Label htmlFor="planId">Membership Plan</Label>
                <Select
                  value={planIdValue}
                  onValueChange={(val: string) => form.setValue('planId', val)}
                >
                  <SelectTrigger
                    id="planId"
                    aria-invalid={!!form.formState.errors.planId}
                    aria-describedby="planId-error"
                  >
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} - ${p.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.planId && (
                  <p id="planId-error" className="text-xs text-destructive">
                    {form.formState.errors.planId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...form.register('startDate')}
                  aria-invalid={!!form.formState.errors.startDate}
                  aria-describedby="startDate-error"
                />
                {form.formState.errors.startDate && (
                  <p id="startDate-error" className="text-xs text-destructive">
                    {form.formState.errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...form.register('endDate')}
                  aria-invalid={!!form.formState.errors.endDate}
                  aria-describedby="endDate-error"
                />
                {form.formState.errors.endDate && (
                  <p id="endDate-error" className="text-xs text-destructive">
                    {form.formState.errors.endDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={statusValue}
                  onValueChange={(val: string) =>
                    form.setValue(
                      'status',
                      val as 'ACTIVE' | 'INACTIVE' | 'FROZEN' | 'EXPIRED' | 'SUSPENDED'
                    )
                  }
                >
                  <SelectTrigger
                    id="status"
                    aria-invalid={!!form.formState.errors.status}
                    aria-describedby="status-error"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                    <SelectItem value="FROZEN">Frozen</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p id="status-error" className="text-xs text-destructive">
                    {form.formState.errors.status.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/memberships')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Confirm Assignment
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
