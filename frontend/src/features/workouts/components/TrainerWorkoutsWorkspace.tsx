import React, { useState } from 'react';
import { useMembers } from '@/features/members/hooks/useMembers';
import { useCreateWorkout } from '../hooks/useWorkouts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { LoadingState } from '@/components/ux/LoadingState';

export const TrainerWorkoutsWorkspace: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState('');
  const { data: membersObj, isLoading } = useMembers({ trainerId: 'me' });
  const createMut = useCreateWorkout();

  const members = membersObj?.results || [];

  const handleAssign = () => {
    createMut.mutate({
      memberId: selectedMember,
      name: 'Custom Assigned Workout',
      exercises: [
        { name: 'Squat', sets: 4, reps: 8 },
        { name: 'Deadlift', sets: 3, reps: 5 },
      ],
    });
  };

  if (isLoading) return <LoadingState text="Loading workspace..." />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Workout Programs</h2>
        <p className="text-muted-foreground mt-1">Assign workouts to your clients.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assign New Workout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-sm">
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger>
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.firstName} {m.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button disabled={!selectedMember || createMut.isPending} onClick={handleAssign}>
            {createMut.isPending ? 'Assigning...' : 'Assign Standard Workout'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
