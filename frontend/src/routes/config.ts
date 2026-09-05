import React from 'react';
import { Role, ROLES } from '@/types/roles';
import {
  Home,
  Users,
  Dumbbell,
  Store,
  Settings,
  CreditCard,
  CalendarCheck,
  FileText,
  Activity,
  Bell,
  User,
  Apple,
  FileSignature,
  ReceiptText,
  Database,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon?: React.ElementType;
  allowedRoles?: Role[]; // If undefined, accessible to anyone logged in
  group?: string; // Optional grouping for sidebars
}

// Global conceptual navigation items
export const NAVIGATION_CONFIG: NavItem[] = [
  {
    id: 'payments',
    label: 'Payments',
    route: '/payments',
    icon: CreditCard,
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.OWNER,
      ROLES.BRANCH_MANAGER,
      ROLES.RECEPTIONIST,
      ROLES.MEMBER,
    ],
    group: 'Revenue',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    route: '/invoices',
    icon: FileSignature,
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.OWNER,
      ROLES.BRANCH_MANAGER,
      ROLES.RECEPTIONIST,
      ROLES.MEMBER,
    ],
    group: 'Revenue',
  },
  {
    id: 'receipts',
    label: 'Receipts',
    route: '/receipts',
    icon: ReceiptText,
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.OWNER,
      ROLES.BRANCH_MANAGER,
      ROLES.RECEPTIONIST,
      ROLES.MEMBER,
    ],
    group: 'Revenue',
  },
  // --- SUPER ADMIN (PLATFORM) ---
  {
    id: 'admin_tenants',
    label: 'Tenants',
    route: '/admin/tenants',
    icon: Database,
    allowedRoles: [ROLES.SUPER_ADMIN],
    group: 'Platform',
  },
  // --- OWNER / ADMIN ---
  {
    id: 'dash_owner',
    label: 'Dashboard',
    route: '/dashboard',
    icon: Home,
    allowedRoles: [ROLES.OWNER],
    group: 'Core',
  },
  {
    id: 'members_owner',
    label: 'Members',
    route: '/members',
    icon: Users,
    allowedRoles: [ROLES.OWNER, ROLES.BRANCH_MANAGER, ROLES.RECEPTIONIST],
    group: 'Core',
  },
  {
    id: 'trainers_owner',
    label: 'Trainers',
    route: '/trainers',
    icon: Dumbbell,
    allowedRoles: [ROLES.OWNER, ROLES.BRANCH_MANAGER],
    group: 'Staff',
  },
  {
    id: 'branches_owner',
    label: 'Branches',
    route: '/branches',
    icon: Store,
    allowedRoles: [ROLES.OWNER],
    group: 'Admin',
  },
  {
    id: 'plans_owner',
    label: 'Plans',
    route: '/plans',
    icon: FileText,
    allowedRoles: [ROLES.OWNER],
    group: 'Admin',
  },
  {
    id: 'attendance_owner',
    label: 'Attendance',
    route: '/attendance',
    icon: CalendarCheck,
    allowedRoles: [ROLES.OWNER, ROLES.BRANCH_MANAGER, ROLES.RECEPTIONIST],
    group: 'Operations',
  },
  {
    id: 'payments_owner',
    label: 'Payments',
    route: '/payments',
    icon: CreditCard,
    allowedRoles: [ROLES.OWNER, ROLES.BRANCH_MANAGER, ROLES.RECEPTIONIST],
    group: 'Operations',
  },
  {
    id: 'reports_owner',
    label: 'Reports',
    route: '/reports',
    icon: Activity,
    allowedRoles: [ROLES.OWNER, ROLES.BRANCH_MANAGER],
    group: 'Analytics',
  },
  {
    id: 'settings_owner',
    label: 'Settings',
    route: '/settings',
    icon: Settings,
    allowedRoles: [ROLES.OWNER],
    group: 'Admin',
  },
  {
    id: 'subscription_owner',
    label: 'Subscription',
    route: '/settings/subscription',
    icon: CreditCard,
    allowedRoles: [ROLES.OWNER],
    group: 'Admin',
  },

  // --- TRAINER ---
  {
    id: 'dash_trainer',
    label: 'Dashboard',
    route: '/trainer/dashboard',
    icon: Home,
    allowedRoles: [ROLES.TRAINER],
    group: 'Workspace',
  },
  {
    id: 'members_trainer',
    label: 'My Members',
    route: '/trainer/members',
    icon: Users,
    allowedRoles: [ROLES.TRAINER],
    group: 'Workspace',
  },
  {
    id: 'workouts_trainer',
    label: 'Workouts',
    route: '/trainer/workouts',
    icon: Dumbbell,
    allowedRoles: [ROLES.TRAINER],
    group: 'Coaching',
  },
  {
    id: 'diets_trainer',
    label: 'Diet Plans',
    route: '/trainer/diets',
    icon: Apple,
    allowedRoles: [ROLES.TRAINER],
    group: 'Coaching',
  },
  {
    id: 'progress_trainer',
    label: 'Progress',
    route: '/trainer/progress',
    icon: Activity,
    allowedRoles: [ROLES.TRAINER],
    group: 'Coaching',
  },

  // --- MEMBER ---
  {
    id: 'dash_member',
    label: 'My Dashboard',
    route: '/member/dashboard',
    icon: Home,
    allowedRoles: [ROLES.MEMBER],
    group: 'Personal',
  },
  {
    id: 'membership_member',
    label: 'Membership',
    route: '/member/membership',
    icon: FileText,
    allowedRoles: [ROLES.MEMBER],
    group: 'Personal',
  },
  {
    id: 'payments_member',
    label: 'Payments',
    route: '/member/payments',
    icon: CreditCard,
    allowedRoles: [ROLES.MEMBER],
    group: 'Personal',
  },
  {
    id: 'attendance_member',
    label: 'Attendance',
    route: '/member/attendance',
    icon: CalendarCheck,
    allowedRoles: [ROLES.MEMBER],
    group: 'Personal',
  },
  {
    id: 'workouts_member',
    label: 'Workouts',
    route: '/member/workouts',
    icon: Dumbbell,
    allowedRoles: [ROLES.MEMBER],
    group: 'Fitness',
  },
  {
    id: 'diet_member',
    label: 'Diet',
    route: '/member/diet',
    icon: Apple,
    allowedRoles: [ROLES.MEMBER],
    group: 'Fitness',
  },
  {
    id: 'progress_member',
    label: 'My Progress',
    route: '/member/progress',
    icon: Activity,
    allowedRoles: [ROLES.MEMBER],
    group: 'Fitness',
  },

  // --- SHARED SPECIFICS ---
  {
    id: 'notifications',
    label: 'Notifications',
    route: '/notifications',
    icon: Bell,
    group: 'User',
  },
  { id: 'profile', label: 'Profile', route: '/profile', icon: User, group: 'User' },
];

export const getNavForRole = (role: Role | undefined): NavItem[] => {
  if (!role) return [];
  return NAVIGATION_CONFIG.filter((nav) => !nav.allowedRoles || nav.allowedRoles.includes(role));
};
