import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export const TermsLink = () => (
  <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
    Terms of Service
  </a>
);

export const PrivacyPolicyLink = () => (
  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
    Privacy Policy
  </a>
);

export interface ConsentCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: React.ReactNode;
  required?: boolean;
  error?: string;
}

export const ConsentCheckbox = ({
  id,
  checked,
  onCheckedChange,
  label,
  required = false,
  error,
}: ConsentCheckboxProps) => {
  return (
    <div className="space-y-1">
      <div className="flex flex-row items-start space-x-3 space-y-0 relative">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={`mt-1 ${error ? 'border-destructive' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
        />
        <div className="leading-none flex-1 mt-0">
          <Label htmlFor={id} className={`text-sm font-normal text-muted-foreground ${error ? 'text-destructive' : ''}`}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-[13px] font-medium text-destructive ml-7">
          {error}
        </p>
      )}
    </div>
  );
};

export const ConsentSummary = ({
  termsAccepted,
  marketingAccepted,
}: {
  termsAccepted: boolean;
  marketingAccepted: boolean;
}) => {
  return (
    <div className="text-xs text-muted-foreground space-y-1">
      <p>
        Terms & Privacy: {termsAccepted ? <span className="text-emerald-500 font-medium">Accepted</span> : <span className="text-destructive font-medium">Required</span>}
      </p>
      <p>
        Marketing Communications: {marketingAccepted ? <span className="text-emerald-500 font-medium">Accepted</span> : <span>Declined</span>}
      </p>
    </div>
  );
};
