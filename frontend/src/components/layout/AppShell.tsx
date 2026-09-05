import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex flex-shrink-0" />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-card pt-5 pb-4 h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button
                variant="ghost"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 text-white" aria-hidden="true" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            </div>
            <Sidebar
              className="h-full flex-1 border-none w-full shadow-none bg-transparent pt-0"
              onNavClick={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-opacity h-screen overflow-hidden">
        <Header toggleMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
