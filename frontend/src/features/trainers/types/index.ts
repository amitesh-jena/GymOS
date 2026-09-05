export type TrainerStatus = 'ACTIVE' | 'INACTIVE';

export interface Trainer {
  id: string;
  tenantId: string;
  branchId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization?: string;
  status: TrainerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrainerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  branchId: string;
  specialization?: string;
  status: TrainerStatus;
}

export type UpdateTrainerPayload = Partial<CreateTrainerPayload>;
