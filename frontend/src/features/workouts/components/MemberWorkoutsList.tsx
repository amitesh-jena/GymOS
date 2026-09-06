import React from 'react';
import { useMemberWorkouts, useCompleteWorkout } from '../hooks/useWorkouts';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const MemberWorkoutsList: React.FC = () => {
  const { data, isLoading, error, refetch } = useMemberWorkouts(1);
  const completeMut = useCompleteWorkout();

  if (isLoading) return <LoadingState text="Loading your workouts..." />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  const workouts = data?.results || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Workouts</h2>
        <p className="text-muted-foreground mt-1">
          View and complete your assigned workout programs.
        </p>
      </div>

      {workouts.length === 0 ? (
        <EmptyState
          title="No workouts found"
          description="You have no assigned workouts at this time."
        />
      ) : (
        <div className="grid gap-4">
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{workout.name}</CardTitle>
                  <Badge variant={workout.status === 'COMPLETED' ? 'default' : 'secondary'}>
                    {workout.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Assigned: {new Date(workout.dateAssigned).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {workout.exercises.map((ex, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm border-b pb-2 last:border-0 hover:bg-muted/50 p-2 rounded"
                    >
                      <span className="font-medium">{ex.name}</span>
                      <span className="text-muted-foreground">
                        {ex.sets} sets x {ex.reps} reps
                      </span>
                    </div>
                  ))}
                </div>
                {workout.status === 'PENDING' && (
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => completeMut.mutate({ workoutId: workout.id })}
                    disabled={completeMut.isPending}
                  >
                    {completeMut.isPending ? 'Marking Complete...' : 'Mark Workout Complete'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
