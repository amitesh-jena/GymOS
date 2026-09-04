import React from 'react';
import { cn } from '@/utils/cn';

export const Dropdown = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("relative inline-block text-left", className)} {...props}>
    {children}
  </div>
);
