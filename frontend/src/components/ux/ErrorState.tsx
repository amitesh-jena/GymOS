import { AlertOctagon, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

export const ErrorState = ({
  message = 'An error occurred',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-destructive/20 bg-destructive/5 text-destructive">
    <AlertOctagon className="h-8 w-8 mb-3 text-destructive" />
    <h3 className="text-lg font-semibold tracking-tight">Something went wrong</h3>
    <p className="mt-1 mb-6 text-sm text-destructive/80 max-w-sm">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="destructive" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    )}
  </div>
);
