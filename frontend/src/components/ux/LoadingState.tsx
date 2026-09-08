import { Loader2 } from 'lucide-react';

export const LoadingState = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center min-h-[50vh]">
    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
    <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
  </div>
);
