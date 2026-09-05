import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';

const tenantSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  contactEmail: z.string().email('Please enter a valid email address'),
  timezone: z.string().min(1, 'Timezone is required'),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

export const TenantSettingsView = () => {
  const { tenantId } = useTenant();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: '',
      contactEmail: '',
      timezone: 'UTC',
    },
  });

  const onSubmit = async (_data: TenantFormValues) => {
    setIsSubmitting(true);
    try {
      // Mock API call to update organization
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast({
        title: 'Organization Updated',
        description: 'Organization settings have been successfully saved.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update organization. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Organization Settings</h2>
        <p className="text-muted-foreground">
          Manage your gym's global details and localized settings.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Core identity configurations for your organization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                placeholder="e.g., Iron Temple Gym"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="e.g., contact@irontemple.example.com"
                aria-invalid={!!errors.contactEmail}
                {...register('contactEmail')}
              />
              {errors.contactEmail && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.contactEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={!!errors.timezone}
                {...register('timezone')}
              >
                <option value="UTC">UTC (Universal Coordinated Time)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
              {errors.timezone && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.timezone.message}
                </p>
              )}
            </div>

            <div className="space-y-1 pt-4">
              <Label className="text-muted-foreground">Tenant ID</Label>
              <div className="font-mono text-sm text-muted-foreground">{tenantId || 'Unknown'}</div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Configuration
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
