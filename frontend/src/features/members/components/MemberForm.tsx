import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberSchema, MemberFormData } from '../schemas';
import { useMember, useCreateMember, useUpdateMember } from '../hooks/useMembers';
import { useTrainers } from '@/features/trainers/hooks/useTrainers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

export function MemberForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: member, isLoading, isError, refetch } = useMember(id || '');
  const { data: trainersData } = useTrainers();
  const createMutation = useCreateMember();
  const updateMutation = useUpdateMember(id || '');

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      branchId: 'branch-hk', // default mock branch
      status: 'ACTIVE',
      joinDate: new Date().toISOString().split('T')[0],
      notes: '',
      trainerId: 'none',
    },
  });

  useEffect(() => {
    if (isEdit && member) {
      form.reset({
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        branchId: member.branchId,
        status: member.status,
        joinDate: member.joinDate.split('T')[0],
        notes: member.notes || '',
        trainerId: member.trainerId || 'none',
      });
    }
  }, [isEdit, member, form]);

  const statusValue = useWatch({ control: form.control, name: 'status' });
  const trainerIdValue = useWatch({ control: form.control, name: 'trainerId' });

  const onSubmit = async (values: MemberFormData) => {
    const payload = { ...values };
    if (payload.trainerId === 'none') {
      delete payload.trainerId;
    }
    if (isEdit) {
      await updateMutation.mutateAsync(payload);
      navigate(`/members/${id}`);
    } else {
      const newMember = await createMutation.mutateAsync(values);
      navigate(`/members/${newMember.id}`);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) return <LoadingState text="Loading member details..." />;
  if (isEdit && (isError || !member))
    return <ErrorState message="Failed to load member for editing." onRetry={() => refetch()} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(isEdit ? `/members/${id}` : '/members')}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to members</span>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            {isEdit ? 'Edit Member' : 'Add New Member'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEdit ? `Update details for ${member?.firstName}` : 'Create a new member profile.'}
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...form.register('firstName')}
                  aria-invalid={!!form.formState.errors.firstName}
                  aria-describedby="firstName-error"
                />
                {form.formState.errors.firstName && (
                  <p id="firstName-error" className="text-xs text-destructive">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...form.register('lastName')}
                  aria-invalid={!!form.formState.errors.lastName}
                  aria-describedby="lastName-error"
                />
                {form.formState.errors.lastName && (
                  <p id="lastName-error" className="text-xs text-destructive">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  aria-invalid={!!form.formState.errors.email}
                  aria-describedby="email-error"
                />
                {form.formState.errors.email && (
                  <p id="email-error" className="text-xs text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register('phone')}
                  aria-invalid={!!form.formState.errors.phone}
                  aria-describedby="phone-error"
                />
                {form.formState.errors.phone && (
                  <p id="phone-error" className="text-xs text-destructive">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={statusValue}
                  onValueChange={(val: string) =>
                    form.setValue('status', val as 'ACTIVE' | 'INACTIVE' | 'FROZEN' | 'LEAD')
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
                    <SelectItem value="FROZEN">Frozen</SelectItem>
                    <SelectItem value="LEAD">Lead</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p id="status-error" className="text-xs text-destructive">
                    {form.formState.errors.status.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="trainerId">Assign Trainer</Label>
                <Select
                  value={trainerIdValue}
                  onValueChange={(val: string) => form.setValue('trainerId', val)}
                >
                  <SelectTrigger
                    id="trainerId"
                    aria-invalid={!!form.formState.errors.trainerId}
                    aria-describedby="trainerId-error"
                  >
                    <SelectValue placeholder="No Trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Trainer</SelectItem>
                    {trainersData?.results?.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.firstName} {t.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.trainerId && (
                  <p id="trainerId-error" className="text-xs text-destructive">
                    {form.formState.errors.trainerId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  {...form.register('joinDate')}
                  aria-invalid={!!form.formState.errors.joinDate}
                  aria-describedby="joinDate-error"
                />
                {form.formState.errors.joinDate && (
                  <p id="joinDate-error" className="text-xs text-destructive">
                    {form.formState.errors.joinDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  {...form.register('notes')}
                  placeholder="Optional internal notes..."
                />
                {form.formState.errors.notes && (
                  <p id="notes-error" className="text-xs text-destructive">
                    {form.formState.errors.notes.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(isEdit ? `/members/${id}` : '/members')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Member
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
