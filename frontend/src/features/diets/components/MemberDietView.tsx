import React from 'react';
import { useMemberDiets } from '../hooks/useDiets';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const MemberDietView: React.FC = () => {
  const { data, isLoading, error, refetch } = useMemberDiets(1);

  if (isLoading) return <LoadingState text="Loading your diet plans..." />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  const diet = data?.results?.[0]; // Show latest assigned diet

  if (!diet)
    return (
      <EmptyState title="No Diet Plan" description="You have not been assigned a diet plan yet." />
    );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Diet Plan</h2>
        <p className="text-muted-foreground mt-1">Review your daily nutritional guidance.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{diet.name}</CardTitle>
              <CardDescription>
                Assigned: {new Date(diet.dateAssigned).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg py-1 px-3">
              {diet.totalCalories} kcal
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {diet.meals.map((meal) => (
            <div key={meal.id} className="border rounded-lg p-4 bg-muted/20">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-lg">{meal.timing}</h4>
                <span className="text-sm font-medium">{meal.calories} kcal</span>
              </div>
              <p className="text-muted-foreground mb-3">{meal.name}</p>
              <div className="flex gap-4 text-xs font-medium">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 px-2 py-1 rounded">
                  P: {meal.macros.p}g
                </span>
                <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 px-2 py-1 rounded">
                  C: {meal.macros.c}g
                </span>
                <span className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200 px-2 py-1 rounded">
                  F: {meal.macros.f}g
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
