import React from 'react';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref} className={`border border-input rounded-md px-3 py-2 bg-background ${className}`} {...props} />
  )
);
Input.displayName = "Input";
