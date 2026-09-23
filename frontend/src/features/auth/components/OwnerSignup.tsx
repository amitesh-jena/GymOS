import { useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignup } from '../hooks/useAuthMutations';
import { ConsentCheckbox, TermsLink, PrivacyPolicyLink } from '@/components/ux/Consent';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid work email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the Terms of Service & Privacy Policy',
  }),
  marketingAccepted: z.boolean(),
});

type SignupForm = z.infer<typeof signupSchema>;

export function OwnerSignup() {
  const { mutate: doSignup, isPending, error } = useSignup();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      termsAccepted: false,
      marketingAccepted: false,
    },
    mode: 'onChange', // enable progressive validation visually
  });

  const termsAccepted = watch('termsAccepted');
  const marketingAccepted = watch('marketingAccepted');

  // eslint-disable-next-line react-hooks/incompatible-library
  const onSubmit: SubmitHandler<SignupForm> = (data) => {
    doSignup(
      {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        consent: {
          termsAccepted: data.termsAccepted,
          privacyAccepted: data.termsAccepted, // they are combined in the UI
          marketingAccepted: data.marketingAccepted,
        },
      },
      {
        onSuccess: () => {
          navigate('/onboarding');
        },
      }
    );
  };

  const isActuallyPending = isPending || isSubmitting;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center p-4 sm:p-8 bg-slate-50">
      <div className="w-full max-w-lg space-y-8 bg-white p-8 sm:p-12 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        {/* Branding */}
        <div className="flex flex-col items-center gap-4 text-center pb-2 border-b border-slate-100">
          <div className="bg-emerald-500 p-3 rounded-2xl shadow-md shadow-emerald-500/20">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create your Gym</h1>
            <p className="text-muted-foreground font-medium">Join GymOS and scale your fitness business.</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-sm font-semibold rounded-lg">
            Registration failed. Please try again or contact support if the issue persists.
          </div>
        )}

        {/* Primary Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-semibold text-slate-900">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Jane Doe"
                {...register('fullName')}
                className={`h-12 bg-slate-50 border-slate-200 ${errors.fullName ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-emerald-500'}`}
                disabled={isActuallyPending}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-sm text-destructive font-medium">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-900">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@yourgym.com"
                {...register('email')}
                className={`h-12 bg-slate-50 border-slate-200 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-emerald-500'}`}
                disabled={isActuallyPending}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-semibold text-slate-900">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register('phone')}
                  className={`h-12 bg-slate-50 border-slate-200 ${errors.phone ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-emerald-500'}`}
                  disabled={isActuallyPending}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-destructive font-medium leading-none mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-900">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`h-12 bg-slate-50 border-slate-200 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-emerald-500'}`}
                  disabled={isActuallyPending}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {errors.password && (
                  <p id="password-error" className="text-sm text-destructive font-medium leading-none mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-4">
            <ConsentCheckbox
              id="termsAccepted"
              checked={!!termsAccepted}
              onCheckedChange={(checked) => setValue('termsAccepted', checked as true, { shouldValidate: true })}
              label={
                <>
                  I agree to the <TermsLink /> and <PrivacyPolicyLink />
                </>
              }
              required
              error={errors.termsAccepted?.message}
            />

            <ConsentCheckbox
              id="marketingAccepted"
              checked={!!marketingAccepted}
              onCheckedChange={(checked) => setValue('marketingAccepted', checked)}
              label="Send me product updates and tips (Optional)"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all bg-emerald-600 hover:bg-emerald-700 text-white" 
            disabled={isActuallyPending}
          >
            {isActuallyPending ? 'Creating Account...' : 'Continue to GymOS'}
          </Button>

          <p className="text-center text-sm text-muted-foreground font-medium pt-2">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-bold text-emerald-600 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
