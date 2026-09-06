export interface ProgressRecord {
  id: string;
  memberId: string;
  date: string;
  weight: number;
  bodyFatPercentage?: number;
  notes?: string;
}
