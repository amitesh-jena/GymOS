import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { DomainProvider } from '@/contexts/DomainContext';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import AppRoutes from '@/routes/AppRoutes';

import { PermissionProvider } from '@/contexts/PermissionContext';
import { EntitlementProvider } from '@/contexts/EntitlementContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DomainProvider>
          <AuthProvider>
            <WorkspaceProvider>
            <PermissionProvider>
              <EntitlementProvider>
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
                <Toaster />
              </EntitlementProvider>
            </PermissionProvider>
            </WorkspaceProvider>
          </AuthProvider>
        </DomainProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
