import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES, Role } from '@/types/roles';
import { UserCircle, Shield, Paintbrush, Building2, CreditCard } from 'lucide-react';
import { cn } from '@/utils/cn';

export const SettingsLayout = () => {
  const { user } = useAuth();
  const role = user?.role as Role;

  const canSeeOrgSettings = [ROLES.OWNER as string, ROLES.SUPER_ADMIN as string].includes(role);

  const navItems = [
    { name: 'Profile', path: '/settings/profile', icon: UserCircle },
    { name: 'Appearance', path: '/settings/appearance', icon: Paintbrush },
    { name: 'Security', path: '/settings/security', icon: Shield },
  ];

  if (canSeeOrgSettings) {
    navItems.push({ name: 'Organization', path: '/settings/organization', icon: Building2 });
    navItems.push({ name: 'Subscription', path: '/settings/subscription', icon: CreditCard });
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      <aside className="md:w-64 flex-shrink-0">
        <nav
          className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0"
          aria-label="Settings navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-primary/10 text-primary hover:bg-primary/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};
