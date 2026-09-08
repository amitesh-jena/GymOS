import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card p-8 rounded-xl shadow-lg border border-border text-center space-y-6">
            <div className="bg-destructive/10 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Something went wrong
              </h2>
              <p className="text-muted-foreground">
                We encountered an unexpected error while trying to display this page.
              </p>
            </div>

            <Button onClick={this.handleReset} className="w-full gap-2 font-semibold">
              <RotateCcw className="w-4 h-4" />
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
