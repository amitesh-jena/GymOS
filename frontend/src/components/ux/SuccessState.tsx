import React from 'react';

interface SuccessStateProps {
  title?: string;
  message?: string;
  children?: React.ReactNode;
}

export const SuccessState = ({ title = 'Success', message, children }: SuccessStateProps) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-card text-card-foreground rounded-lg border">
    <h3 className="mt-4 text-primary font-semibold text-lg">{title}</h3>
    {message && <p className="mt-2 text-muted-foreground">{message}</p>}
    {children && <div className="mt-6">{children}</div>}
  </div>
);
