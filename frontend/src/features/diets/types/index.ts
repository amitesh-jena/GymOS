export interface Meal {
  id: string;
  timing: string;
  name: string;
  calories: number;
  macros: { p: number; c: number; f: number };
}

export interface DietPlan {
  id: string;
  memberId: string;
  name: string;
  dateAssigned: string;
  totalCalories: number;
  meals: Meal[];
  createdAt: string;
  updatedAt: string;
}
