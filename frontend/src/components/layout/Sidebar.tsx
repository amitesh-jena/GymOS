import { useLocation, Link, matchPath } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getNavForRole, NavItem } from '@/routes/config';
import { cn } from '@/utils/cn';
import { Role } from '@/types/roles';

export function Sidebar({
  className,
  onNavClick,
}: {
  className?: string;
  onNavClick?: () => void;
}) {
  const { user } = useAuth();
  const location = useLocation();
  const navItems = getNavForRole(user?.role as Role);

  // Group items
  const grouped = navItems.reduce(
    (acc, item) => {
      const g = item.group || 'Other';
      if (!acc[g]) acc[g] = [];
      acc[g].push(item);
      return acc;
    },
    {} as Record<string, NavItem[]>
  );

  return (
    <aside
      className={cn('w-64 border-r bg-card flex flex-col pt-4 overflow-y-auto h-full', className)}
    >
      <div className="px-6 pb-6">
        <h1 className="text-2xl font-bold text-primary tracking-tight">GymOS</h1>
      </div>

      <nav className="flex-1 px-4 space-y-6">
        {Object.entries(grouped).map(([groupName, items]) => (
          <div key={groupName}>
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {groupName}
            </h3>
            <ul className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = matchPath({ path: item.route, end: false }, location.pathname);
                return (
                  <li key={item.id}>
                    <Link
                      to={item.route}
                      onClick={onNavClick}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isActive
                          ? 'bg-accent text-accent-foreground font-semibold'
                          : 'text-muted-foreground'
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t mt-auto">
        <p className="text-xs text-muted-foreground text-center">© 2026 GymOS Foundation</p>
      </div>
    </aside>
  );
}
