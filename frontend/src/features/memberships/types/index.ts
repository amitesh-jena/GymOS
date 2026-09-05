export type MembershipStatus = 'ACTIVE' | 'INACTIVE' | 'FROZEN' | 'EXPIRED' | 'SUSPENDED';

export interface Membership {
  id: string;
  tenantId: string;
  memberId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMembershipPayload {
  memberId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
}
