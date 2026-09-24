import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { formatMoney, adaptMajorToMinor } from '../src/utils/currency';
import { Money } from '../src/components/finance/Money';
import { PaymentStatusBadge } from '../src/components/finance/PaymentStatusBadge';

describe('F7 Phase: Finance & Currency Formatter', () => {
  describe('formatMoney functionality', () => {
    it('correctly handles USD (2 minor units)', () => {
      // 10050 minor units in USD is $100.50
      expect(formatMoney(10050, 'USD')).toMatch(/\$100\.50/);
    });

    it('correctly handles INR (2 minor units)', () => {
      // 150000 in INR is â‚¹1,500.00
      const formattedValue = formatMoney(150000, 'INR');
      expect(formattedValue.includes('1,500.00')).toBe(true);
      expect(formattedValue.includes('₹')).toBe(true);
    });

    it('correctly handles JPY (0 minor units)', () => {
      // JPY has no minor units, so 5000 is 5,000 Yen
      expect(formatMoney(5000, 'JPY')).toMatch(/¥5,000/);
    });

    it('correctly handles KWD (3 minor units)', () => {
      // 3-decimal currency: 10500 minor units is 10.500
      const formatted = formatMoney(10500, 'KWD');
      expect(formatted.includes('10.500')).toBe(true);
    });

    it('handles zero values appropriately', () => {
      expect(formatMoney(0, 'USD')).toMatch(/\$0\.00/);
      expect(formatMoney(0, 'JPY')).toMatch(/¥0/);
    });

    it('handles extremely large values explicitly', () => {
      expect(formatMoney(1000000000, 'USD')).toMatch(/10,000,000\.00/);
    });
  });

  describe('Legacy API Compatibility (adaptMajorToMinor)', () => {
    it('correctly adapts $49.99 string (legacy) -> 4999 minor units -> $49.99 rendered display', () => {
      const apiValue = "49.99"; // string representing USD major float
      const minor = adaptMajorToMinor(apiValue, 'USD');
      expect(minor).toBe(4999);
      // Validating it renders gracefully:
      const rendered = formatMoney(minor, 'USD');
      expect(rendered.includes('49.99')).toBe(true);
      // Validating NO test assumes 49.99 USD -> $0.50:
      expect(rendered).not.toMatch(/\$0\.50/);
    });

    it('correctly adapts KWD 3-decimal currencies', () => {
      const apiValue = "10.500";
      const minor = adaptMajorToMinor(apiValue, 'KWD');
      expect(minor).toBe(10500);
    });

    it('correctly adapts JPY zero-decimal currencies', () => {
      const apiValue = "5000";
      const minor = adaptMajorToMinor(apiValue, 'JPY');
      expect(minor).toBe(5000); // For JPY, major === minor
    });
  });

  describe('Money component', () => {
    it('renders formatted money correctly', () => {
      render(<Money amountMinorUnits={5025} currencyCode="EUR" data-testid="money-render" />);
      // 5025 minor units EUR = â‚¬50.25
      const content = screen.getByText(/50\.25/);
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('font-mono');
    });

    it('respects string inputs logically parsing numerical fallbacks', () => {
      render(<Money amountMinorUnits="1050" currencyCode="USD" />);
      expect(screen.getByText(/\$10\.50/)).toBeInTheDocument();
    });
  });

  describe('PaymentStatusBadge component', () => {
    it('renders PENDING and PROCESSING distinctly', () => {
      const { rerender } = render(<PaymentStatusBadge status="PENDING" />);
      expect(screen.getByText('Pending')).toBeInTheDocument();

      rerender(<PaymentStatusBadge status="PROCESSING" />);
      expect(screen.getByText('Processing')).toBeInTheDocument();
    });

    it('renders SUCCESSFUL or COMPLETED as Successful', () => {
      const { rerender } = render(<PaymentStatusBadge status="COMPLETED" />);
      expect(screen.getByText('Successful')).toBeInTheDocument();

      rerender(<PaymentStatusBadge status="SUCCESSFUL" />);
      // Both match the text "Successful"
      expect(screen.getAllByText('Successful').length).toBe(1);
    });

    it('renders Failed and Refunded states distinctly', () => {
      render(<PaymentStatusBadge status="FAILED" />);
      expect(screen.getByText('Failed')).toBeInTheDocument();

      render(<PaymentStatusBadge status="REFUNDED" />);
      expect(screen.getByText('Refunded')).toBeInTheDocument();
    });
  });
});
