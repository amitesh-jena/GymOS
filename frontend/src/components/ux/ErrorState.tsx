import { Button } from "../ui/Button";

export const ErrorState = ({ message = "An error occurred", onRetry }: { message?: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center border-destructive rounded-lg bg-destructive/10 text-destructive">
    <h3 className="font-semibold mb-2">Error</h3>
    <p className="mb-4">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="destructive">Retry</Button>
    )}
  </div>
);
