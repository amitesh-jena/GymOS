import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ROLES, Role } from '@/types/roles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Dumbbell, Zap } from 'lucide-react';
import { useLogin } from './hooks/useAuthMutations';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function AuthSimulator() {
  const { mutate: doLogin, isPending } = useLogin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    // Treat the main login form intelligently based on email keywords for MSW fallback
    let guessedRole: Role = ROLES.OWNER;
    if (data.email.includes('admin')) guessedRole = ROLES.SUPER_ADMIN;
    if (data.email.includes('manager')) guessedRole = ROLES.BRANCH_MANAGER;
    if (data.email.includes('trainer')) guessedRole = ROLES.TRAINER;
    if (data.email.includes('member')) guessedRole = ROLES.MEMBER;
    if (data.email.includes('reception')) guessedRole = ROLES.RECEPTIONIST;

    doLogin(
      { email: data.email, password: data.password, roleHint: guessedRole },
      {
        onSuccess: () => navigate('/'),
      }
    );
  };

  const handleSimulateLogin = (role: Role) => {
    doLogin(
      { email: `mock-${role.toLowerCase()}@gymos.local`, password: 'password', roleHint: role },
      {
        onSuccess: () => navigate('/'),
      }
    );
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-background font-sans">
      {/* LEFT COLUMN: Visual/Branding (Desktop Only) */}
      <div className="hidden lg:flex flex-col bg-slate-900 border-r border-slate-800 text-slate-50 relative overflow-hidden p-12 lg:p-16 xl:p-24 justify-between">
        {/* Subtle decorative background gradients leveraging electric green / emerald */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
              <Dumbbell className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">GymOS</span>
          </div>

          <div className="space-y-8 max-w-md">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
              The operating system for modern fitness.
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              Manage memberships, scale your branches, and engage your members with a premium, all-in-one platform built for growth.
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-8 mt-12">
          <div className="flex items-start gap-5 text-slate-300">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 shadow-inner">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="pt-1">
              <p className="font-semibold text-slate-200 text-base">Real-time Analytics</p>
              <p className="text-sm text-slate-400 mt-1">Track revenue and attendance across every branch.</p>
            </div>
          </div>
          <div className="flex items-start gap-5 text-slate-300">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 shadow-inner">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="pt-1">
              <p className="font-semibold text-slate-200 text-base">Automated Billing</p>
              <p className="text-sm text-slate-400 mt-1">Never miss a renewal with intelligent reminders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication */}
      <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12 xl:p-16 h-full relative overflow-y-auto">
        <div className="mx-auto w-full max-w-md space-y-10">
          
          {/* Mobile Branding */}
          <div className="flex items-center gap-3 lg:hidden justify-center mb-4">
            <div className="bg-primary p-2.5 rounded-xl shadow-sm">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-foreground">GymOS</span>
          </div>

          <div className="space-y-3 text-center lg:text-left">
            <h1 className="sr-only">GymOS</h1>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome back</h2>
            <p className="text-muted-foreground font-medium text-base">Sign in to your account to continue.</p>
          </div>

          {/* Primary Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className={`h-12 bg-background border-input ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  disabled={isPending}
                />
                {errors.email && (
                  <p className="text-sm text-destructive font-medium">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-semibold text-primary hover:underline hover:text-primary/90 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`h-12 bg-background border-input ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  disabled={isPending}
                />
                {errors.password && (
                  <p className="text-sm text-destructive font-medium">{errors.password.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all" disabled={isPending}>
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground font-medium mt-6">
            Don't have a business account?{' '}
            <Link to="#" className="font-bold text-primary hover:underline hover:text-primary/90 transition-colors">
              Request a demo
            </Link>
          </p>

          {/* Divider */}
          <div className="relative mt-12 mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-background px-3 text-muted-foreground font-bold">Developer Tools</span>
            </div>
          </div>

          {/* Development Role Simulator */}
          <div className="rounded-xl border border-border bg-card/40 text-card-foreground shadow-sm overflow-hidden p-5 space-y-4">
            <div className="flex flex-col text-left gap-1">
              <span className="font-bold text-sm tracking-tight text-foreground">Role Simulator</span>
              <span className="text-xs text-muted-foreground font-medium">Bypass authentication for local development</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <Button size="sm" onClick={() => handleSimulateLogin(ROLES.SUPER_ADMIN)} variant="outline" className="justify-start font-medium text-xs h-9 text-muted-foreground">
                Login as Super Admin
              </Button>
              <Button size="sm" onClick={() => handleSimulateLogin(ROLES.OWNER)} variant="secondary" className="justify-start font-medium text-xs h-9 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-primary/20">
                Login as Gym Owner
              </Button>
              <Button size="sm" onClick={() => handleSimulateLogin(ROLES.BRANCH_MANAGER)} variant="outline" className="justify-start font-medium text-xs h-9 text-muted-foreground">
                Login as Branch Manager
              </Button>
              <Button size="sm" onClick={() => handleSimulateLogin(ROLES.RECEPTIONIST)} variant="outline" className="justify-start font-medium text-xs h-9 text-muted-foreground">
                Login as Receptionist
              </Button>
              <Button size="sm" onClick={() => handleSimulateLogin(ROLES.TRAINER)} variant="outline" className="justify-start font-medium text-xs h-9 text-muted-foreground">
                Login as Trainer
              </Button>
              <Button size="sm" onClick={() => handleSimulateLogin(ROLES.MEMBER)} variant="outline" className="justify-start font-medium text-xs h-9 text-muted-foreground">
                Login as Member
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
