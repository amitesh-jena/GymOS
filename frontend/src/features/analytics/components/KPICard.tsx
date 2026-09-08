import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number; // percentage change
  loading?: boolean;
  error?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  loading,
  error,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : error ? (
          <div className="flex items-center text-destructive text-sm gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Failed to load</span>
          </div>
        ) : (
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="flex items-center gap-2 mt-1">
              {trend !== undefined && (
                <span
                  className={clsx(
                    'text-xs font-medium',
                    trend > 0
                      ? 'text-green-600'
                      : trend < 0
                        ? 'text-red-600'
                        : 'text-muted-foreground'
                  )}
                >
                  {trend > 0 ? '+' : ''}
                  {trend}%
                </span>
              )}
              {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
