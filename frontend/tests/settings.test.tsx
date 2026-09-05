import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { AppearanceSettingsView } from '../src/features/settings/components/AppearanceSettingsView';
import { ErrorBoundary } from '../src/components/layout/ErrorBoundary';
import { MemoryRouter } from 'react-router-dom';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('AppearanceSettingsView & ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('renders theme options', () => {
    renderWithTheme(<AppearanceSettingsView />);
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('Tinted')).toBeInTheDocument();
  });

  it('changes theme on click and updates document class', async () => {
    renderWithTheme(<AppearanceSettingsView />);
    
    const darkButton = screen.getByRole('button', { name: /Dark/i });
    fireEvent.click(darkButton);

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark');
      expect(localStorage.getItem('gymos-ui-theme')).toBe('dark');
    });
  });
});

describe('ErrorBoundary', () => {
  const Bomb = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
      throw new Error('Kaboom');
    }
    return <div>Safe component</div>;
  };

  it('catches errors and renders fallback UI', () => {
    // Suppress console.error for the intentional throw
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Application/i })).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe component')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });
});
