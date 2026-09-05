import { useNavigate } from 'react-router-dom';
import { NotAuthorizedState } from '@/components/ux/NotAuthorizedState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center">
        <EmptyState
          title="404 - Page Not Found"
          description="The resource you are looking for does not exist or has been moved."
        />
        <div className="mt-4 flex justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ForbiddenScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <NotAuthorizedState onGoBack={() => navigate('/')} />
    </div>
  );
}

export function MaintenanceScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10 mb-6">
        <Wrench className="h-8 w-8 text-warning" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Under Maintenance</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        GymOS is currently undergoing scheduled maintenance to improve our systems. We will be back
        online shortly.
      </p>
    </div>
  );
}
