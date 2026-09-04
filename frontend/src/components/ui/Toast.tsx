import React from 'react';
import { cn } from '@/utils/cn';

export const Toast = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all", className)} {...props}>
    {children}
  </div>
);
