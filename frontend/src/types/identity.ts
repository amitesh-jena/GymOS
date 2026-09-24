import { Role } from './roles';

export interface BranchAccess {
  branchId: string;
  name: string;
}

export interface RoleAssignment {
  id: string; // The assignment ID
  role: Role; // e.g. TRAINER, OWNER
  branches: BranchAccess[]; // Allowed branches for this role
}

export interface StaffProfile {
  id: string;
  roleAssignments: RoleAssignment[];
}

export interface MemberProfile {
  id: string;
  branchId: string;
}

export interface TenantRelationship {
  tenantId: string;
  tenantName: string;
  staffProfile?: StaffProfile;
  memberProfile?: MemberProfile;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  tenants: TenantRelationship[];
}
