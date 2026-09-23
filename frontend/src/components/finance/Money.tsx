import React from 'react';
import { formatMoney } from '@/utils/currency';

export interface MoneyProps {
  amountMinorUnits: number | string;
  currencyCode: string;
  className?: string;
}

export const Money: React.FC<MoneyProps> = ({ amountMinorUnits, currencyCode, className = '' }) => {
  const amount = typeof amountMinorUnits === 'string' ? parseFloat(amountMinorUnits) : amountMinorUnits;
  const formatted = formatMoney(amount, currencyCode);

  return <span className={`font-mono ${className}`}>{formatted}</span>;
};
