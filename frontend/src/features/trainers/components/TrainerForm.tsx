import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trainerSchema, TrainerFormData } from '../schemas';
import { useTrainer, useCreateTrainer, useUpdateTrainer } from '../hooks/useTrainers';
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

export function TrainerForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: trainer, isLoading, isError, refetch } = useTrainer(id || '');
  const createMutation = useCreateTrainer();
  const updateMutation = useUpdateTrainer(id || '');

  const form = useForm<TrainerFormData>({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      branchId: 'branch-hk',
      specialization: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (isEdit && trainer) {
      form.reset({
        firstName: trainer.firstName,
        lastName: trainer.lastName,
        email: trainer.email,
        phone: trainer.phone,
        branchId: trainer.branchId,
        specialization: trainer.specialization || '',
        status: trainer.status,
      });
    }
  }, [isEdit, trainer, form]);

  const statusValue = useWatch({ control: form.control, name: 'status' });

  const onSubmit = async (values: TrainerFormData) => {
    if (isEdit) {
      await updateMutation.mutateAsync(values);
      navigate(`/trainers/${id}`);
    } else {
      const newTrainer = await createMutation.mutateAsync(values);
      navigate(`/trainers/${newTrainer.id}`);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) return <LoadingState text="Loading trainer details..." />;
  if (isEdit && (isError || !trainer))
    return <ErrorState message="Failed to load trainer for editing." onRetry={() => refetch()} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(isEdit ? `/trainers/${id}` : '/trainers')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            {isEdit ? 'Edit Trainer' : 'Add New Trainer'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEdit ? `Update details for ${trainer?.firstName}` : 'Register a new staff trainer.'}
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...form.register('firstName')} />
                {form.formState.errors.firstName && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...form.register('lastName')} />
                {form.formState.errors.lastName && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register('email')} />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" {...form.register('phone')} />
                {form.formState.errors.phone && (
                  <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  {...form.register('specialization')}
                  placeholder="e.g. Powerlifting, Functional Training"
                />
                {form.formState.errors.specialization && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.specialization.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={statusValue}
                  onValueChange={(val: string) =>
                    form.setValue('status', val as 'ACTIVE' | 'INACTIVE')
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p className="text-xs text-destructive">{form.formState.errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(isEdit ? `/trainers/${id}` : '/trainers')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Trainer
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
