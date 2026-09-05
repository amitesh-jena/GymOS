export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  OWNER: 'OWNER',
  BRANCH_MANAGER: 'BRANCH_MANAGER',
  RECEPTIONIST: 'RECEPTIONIST',
  TRAINER: 'TRAINER',
  MEMBER: 'MEMBER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Default route destinations based on roles
export const ROLE_DEFAULT_DESTINATION: Record<Role, string> = {
  [ROLES.SUPER_ADMIN]: '/admin/dashboard',
  [ROLES.OWNER]: '/dashboard',
  [ROLES.BRANCH_MANAGER]: '/branch/dashboard',
  [ROLES.RECEPTIONIST]: '/branch/front-desk',
  [ROLES.TRAINER]: '/trainer/dashboard',
  [ROLES.MEMBER]: '/member/dashboard',
};
