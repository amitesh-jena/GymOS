export type PlanType =
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'HALF_YEARLY'
  | 'ANNUAL'
  | 'CUSTOM'
  | 'PT_PACKAGE'
  | 'NUTRITION'
  | 'ADD_ON';

export type PlanStatus = 'OPEN' | 'ARCHIVED';

export interface MembershipPlan {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  type: PlanType;
  price: string; // Monetary values represented as decimal strings
  durationDays: number;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanPayload {
  name: string;
  description?: string;
  type: PlanType;
  price: string;
  durationDays: number;
  status: PlanStatus;
}

export type UpdatePlanPayload = Partial<CreatePlanPayload>;
