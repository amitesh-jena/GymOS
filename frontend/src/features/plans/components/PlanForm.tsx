import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { planSchema, PlanFormData } from '../schemas';
import { usePlan, useCreatePlan, useUpdatePlan } from '../hooks/usePlans';
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

export function PlanForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: plan, isLoading, isError, refetch } = usePlan(id || '');
  const createMutation = useCreatePlan();
  const updateMutation = useUpdatePlan(id || '');

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'MONTHLY',
      price: '',
      durationDays: 30,
      status: 'OPEN',
    },
  });

  useEffect(() => {
    if (isEdit && plan) {
      form.reset({
        name: plan.name,
        description: plan.description || '',
        type: plan.type,
        price: plan.price,
        durationDays: plan.durationDays,
        status: plan.status,
      });
    }
  }, [isEdit, plan, form]);

  const typeValue = useWatch({ control: form.control, name: 'type' });
  const statusValue = useWatch({ control: form.control, name: 'status' });

  const onSubmit = async (values: PlanFormData) => {
    if (isEdit) {
      await updateMutation.mutateAsync(values);
    } else {
      await createMutation.mutateAsync(values);
    }
    navigate('/plans');
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) return <LoadingState text="Loading plan details..." />;
  if (isEdit && (isError || !plan))
    return <ErrorState message="Failed to load plan." onRetry={() => refetch()} />;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/plans')}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to plans</span>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            {isEdit ? 'Edit Plan' : 'Create New Plan'}
          </h2>
          <p className="text-sm text-muted-foreground">Configure pricing and duration details.</p>
        </div>
      </div>

      <Card>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  aria-invalid={!!form.formState.errors.name}
                  aria-describedby="name-error"
                />
                {form.formState.errors.name && (
                  <p id="name-error" className="text-xs text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={3} {...form.register('description')} />
                {form.formState.errors.description && (
                  <p id="description-error" className="text-xs text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Plan Type</Label>
                <Select
                  value={typeValue}
                  onValueChange={(val: string) =>
                    form.setValue(
                      'type',
                      val as
                        | 'MONTHLY'
                        | 'QUARTERLY'
                        | 'HALF_YEARLY'
                        | 'ANNUAL'
                        | 'CUSTOM'
                        | 'PT_PACKAGE'
                        | 'NUTRITION'
                        | 'ADD_ON'
                    )
                  }
                >
                  <SelectTrigger
                    id="type"
                    aria-invalid={!!form.formState.errors.type}
                    aria-describedby="type-error"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                    <SelectItem value="ANNUAL">Annual</SelectItem>
                    <SelectItem value="PT_PACKAGE">PT Package</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p id="type-error" className="text-xs text-destructive">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={statusValue}
                  onValueChange={(val: string) =>
                    form.setValue('status', val as 'OPEN' | 'ARCHIVED')
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
                    <SelectItem value="OPEN">Open (Available)</SelectItem>
                    <SelectItem value="ARCHIVED">Archived (Hidden)</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p id="status-error" className="text-xs text-destructive">
                    {form.formState.errors.status.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price Structure ($)</Label>
                <Input
                  id="price"
                  placeholder="e.g. 49.99"
                  {...form.register('price')}
                  aria-invalid={!!form.formState.errors.price}
                  aria-describedby="price-error"
                />
                {form.formState.errors.price && (
                  <p id="price-error" className="text-xs text-destructive">
                    {form.formState.errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationDays">Duration (Days)</Label>
                <Input
                  id="durationDays"
                  type="number"
                  {...form.register('durationDays', { valueAsNumber: true })}
                />
                {form.formState.errors.durationDays && (
                  <p id="durationDays-error" className="text-xs text-destructive">
                    {form.formState.errors.durationDays.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/plans')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Plan
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
