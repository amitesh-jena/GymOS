import React from 'react';
import { cn } from '@/utils/cn';

export const Tabs = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col", className)} {...props}>
    {children}
  </div>
);
