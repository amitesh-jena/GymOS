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

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SecurityFormValues = z.infer<typeof securitySchema>;

export const SecuritySettingsView = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
  });

  const onSubmit = async (_data: SecurityFormValues) => {
    setIsSubmitting(true);
    try {
      // Mock API call to change password
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully changed.',
      });
      reset();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update password. Please check your current password and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Security Settings</h2>
        <p className="text-muted-foreground">Manage your credentials and secure your account.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                aria-invalid={!!errors.currentPassword}
                {...register('currentPassword')}
              />
              {errors.currentPassword && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                aria-invalid={!!errors.newPassword}
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
