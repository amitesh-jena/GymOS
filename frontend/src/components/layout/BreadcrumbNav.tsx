import { useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { NAVIGATION_CONFIG } from '@/routes/config';

export function BreadcrumbNav() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  // Fallback map for paths not directly in navigation config
  const routeLabels: Record<string, string> = {};
  NAVIGATION_CONFIG.forEach((nav) => {
    routeLabels[nav.route] = nav.label;
  });

  return (
    <Breadcrumb className="hidden sm:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          const href = `/${paths.slice(0, index + 1).join('/')}`;

          // Attempt to find a defined label, fallback to capitalized path
          const label = routeLabels[href] || path.charAt(0).toUpperCase() + path.slice(1);

          return (
            <div key={path} className="flex items-center gap-1.5 sm:gap-2.5">
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
