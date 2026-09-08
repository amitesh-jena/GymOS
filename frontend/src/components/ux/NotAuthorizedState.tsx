import { ShieldAlert } from 'lucide-react';
import { Button } from '../ui/button';

export const NotAuthorizedState = ({ onGoBack }: { onGoBack?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border bg-card">
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
      <ShieldAlert className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-semibold text-foreground tracking-tight">Access Denied</h3>
    <p className="mt-2 mb-6 text-sm text-muted-foreground max-w-md">
      You do not have the required permissions to view this resource. Please contact your workspace
      administrator if you believe this is a mistake.
    </p>
    {onGoBack && (
      <Button onClick={onGoBack} variant="outline">
        Go Back
      </Button>
    )}
  </div>
);
