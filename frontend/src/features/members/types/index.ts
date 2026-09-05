export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'FROZEN' | 'LEAD';

export interface Member {
  id: string;
  tenantId: string;
  branchId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: MemberStatus;
  joinDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  branchId: string;
  status: MemberStatus;
  joinDate: string;
  notes?: string;
}

export type UpdateMemberPayload = Partial<CreateMemberPayload>;
