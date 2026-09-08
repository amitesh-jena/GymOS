export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed?: boolean;
}

export interface Workout {
  id: string;
  memberId: string;
  name: string;
  dateAssigned: string;
  status: 'PENDING' | 'COMPLETED';
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutCompletionPayload {
  workoutId: string;
}
