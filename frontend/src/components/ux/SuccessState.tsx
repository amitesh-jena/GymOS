import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessStateProps {
  title?: string;
  message?: string;
  children?: React.ReactNode;
}

export const SuccessState = ({ title = 'Success', message, children }: SuccessStateProps) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-card text-card-foreground rounded-lg border">
    <CheckCircle2 className="h-10 w-10 text-success mb-4" />
    <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
    {message && <p className="mt-1 text-sm text-muted-foreground max-w-sm">{message}</p>}
    {children && <div className="mt-6 w-full flex justify-center">{children}</div>}
  </div>
);
