import React from 'react';
import { cn } from '@/utils/cn';

export const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props}>
    {children}
  </div>
);
