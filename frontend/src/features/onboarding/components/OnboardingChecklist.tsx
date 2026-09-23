import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, CheckCircle2, Circle, ArrowRight, ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/contexts/WorkspaceContext';

type OnboardingStepId = 'create_gym' | 'subscription' | 'create_branch' | 'create_staff' | 'create_members' | 'membership';

interface Step {
  id: OnboardingStepId;
  label: string;
  isActionable: boolean;
  actionText?: string;
  navigateTo?: string;
}

const ONBOARDING_STEPS: Step[] = [
  { id: 'create_gym', label: 'Create Gym', isActionable: false },
  { id: 'subscription', label: 'Subscription', isActionable: true, actionText: 'Select Plan', navigateTo: '/settings/subscription' },
  { id: 'create_branch', label: 'Create Branch', isActionable: true, actionText: 'Add Branch', navigateTo: '/settings/organization' },
  { id: 'create_staff', label: 'Create Staff', isActionable: true, actionText: 'Add Staff', navigateTo: '/trainers/new' },
  { id: 'create_members', label: 'Create Members', isActionable: true, actionText: 'Add Member', navigateTo: '/members/new' },
  { id: 'membership', label: 'Membership', isActionable: true, actionText: 'Assign Plan', navigateTo: '/memberships/assign' },
];

export function OnboardingChecklist() {
  const navigate = useNavigate();
  const { activeTenant, availableBranches } = useWorkspace();

  // In a real application, this state would come from the backend.
  // For the frontend architecture abstraction, we use local state seeded by Context.
  const [completedSteps] = useState<Record<OnboardingStepId, boolean>>({
    create_gym: !!activeTenant, // Auto-completed if tenant exists
    subscription: false,
    create_branch: availableBranches.length > 0,
    create_staff: false,
    create_members: false,
    membership: false,
  });

  const getStepStatus = (stepId: OnboardingStepId, prevStepCompleted?: boolean): 'completed' | 'current' | 'upcoming' => {
    if (completedSteps[stepId]) return 'completed';
    // If it's the first step, or the previous step is completed, it's current
    if (prevStepCompleted !== false) return 'current';
    return 'upcoming';
  };

  const handleAction = (step: Step) => {
    if (step.navigateTo) {
      navigate(step.navigateTo);
    }
  };



  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-slate-50 py-12 px-4 sm:px-8">
      <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-600 px-8 py-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm" />
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Dumbbell className="w-48 h-48 transform rotate-12 translate-x-12 -translate-y-12" />
          </div>
          <div className="relative z-10 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Gym Setup</h1>
            <p className="text-emerald-50 text-lg font-medium max-w-lg">
              Welcome to GymOS! Complete these few steps to unlock the full potential of your fitness business.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="p-2 sm:p-4">
          <div className="space-y-1">
            {ONBOARDING_STEPS.map((step, index) => {
              const prevStepId = index > 0 ? ONBOARDING_STEPS[index - 1].id : null;
              const prevCompleted = prevStepId ? completedSteps[prevStepId] : true;
              const status = getStepStatus(step.id, prevCompleted);

              return (
                <div 
                  key={step.id} 
                  className={`p-4 sm:px-6 sm:py-5 flex items-center justify-between rounded-xl transition-colors ${
                    status === 'current' ? 'bg-slate-50 border border-slate-200' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    ) : status === 'current' ? (
                      <ArrowRightCircle className="w-6 h-6 text-primary flex-shrink-0 animate-pulse" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 flex-shrink-0" />
                    )}
                    
                    <div>
                      <h3 className={`font-semibold text-base sm:text-lg ${status === 'upcoming' ? 'text-slate-400' : 'text-slate-900'}`}>
                        {step.label}
                      </h3>
                      {status === 'current' && (
                        <p className="text-sm text-muted-foreground font-medium mt-0.5">Ready to configure</p>
                      )}
                    </div>
                  </div>

                  {status === 'current' && step.isActionable && (
                    <Button 
                      onClick={() => handleAction(step)}
                      className="shrink-0 bg-primary shadow-sm"
                    >
                      {step.actionText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  {status === 'completed' && (
                    <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest px-2">
                      Done
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Button variant="ghost" className="font-semibold text-slate-500 hover:text-slate-900" onClick={() => navigate('/')}>
          Skip to Dashboard for now
        </Button>
      </div>
    </div>
  );
}
