import React from 'react';
import { Permission, PERMISSIONS } from '@/types/permissions';
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
  permission?: Permission; // If undefined, accessible to anyone logged in
  group?: string; // Optional grouping for sidebars
}

// Global conceptual navigation items
export const NAVIGATION_CONFIG: NavItem[] = [
  {
    id: 'payments',
    label: 'Payments',
    route: '/payments',
    icon: CreditCard,
    permission: PERMISSIONS.PAYMENT_VIEW,
    group: 'Revenue',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    route: '/invoices',
    icon: FileSignature,
    permission: PERMISSIONS.INVOICE_VIEW,
    group: 'Revenue',
  },
  {
    id: 'receipts',
    label: 'Receipts',
    route: '/receipts',
    icon: ReceiptText,
    permission: PERMISSIONS.RECEIPT_VIEW,
    group: 'Revenue',
  },
  // --- SUPER ADMIN (PLATFORM) ---
  {
    id: 'admin_tenants',
    label: 'Tenants',
    route: '/admin/tenants',
    icon: Database,
    permission: PERMISSIONS.TENANT_VIEW,
    group: 'Platform',
  },
  // --- OWNER / ADMIN ---
  {
    id: 'dash_owner',
    label: 'Dashboard',
    route: '/dashboard',
    icon: Home,
    permission: PERMISSIONS.DASHBOARD_OWNER,
    group: 'Core',
  },
  {
    id: 'members_owner',
    label: 'Members',
    route: '/members',
    icon: Users,
    permission: PERMISSIONS.MEMBER_VIEW,
    group: 'Core',
  },
  {
    id: 'trainers_owner',
    label: 'Trainers',
    route: '/trainers',
    icon: Dumbbell,
    permission: PERMISSIONS.TRAINER_VIEW,
    group: 'Staff',
  },
  {
    id: 'branches_owner',
    label: 'Branches',
    route: '/branches',
    icon: Store,
    permission: PERMISSIONS.BRANCH_VIEW,
    group: 'Admin',
  },
  {
    id: 'plans_owner',
    label: 'Plans',
    route: '/plans',
    icon: FileText,
    permission: PERMISSIONS.PLAN_VIEW,
    group: 'Admin',
  },
  {
    id: 'attendance_owner',
    label: 'Attendance',
    route: '/attendance',
    icon: CalendarCheck,
    permission: PERMISSIONS.ATTENDANCE_VIEW,
    group: 'Operations',
  },
  {
    id: 'reports_owner',
    label: 'Reports',
    route: '/reports',
    icon: Activity,
    permission: PERMISSIONS.REPORT_VIEW,
    group: 'Analytics',
  },
  {
    id: 'settings_owner',
    label: 'Settings',
    route: '/settings',
    icon: Settings,
    permission: PERMISSIONS.SETTINGS_MANAGE,
    group: 'Admin',
  },
  {
    id: 'subscription_owner',
    label: 'Subscription',
    route: '/settings/subscription',
    icon: CreditCard,
    permission: PERMISSIONS.SUBSCRIPTION_MANAGE,
    group: 'Admin',
  },

  // --- TRAINER ---
  {
    id: 'dash_trainer',
    label: 'Dashboard',
    route: '/trainer/dashboard',
    icon: Home,
    permission: PERMISSIONS.DASHBOARD_TRAINER,
    group: 'Workspace',
  },
  {
    id: 'members_trainer',
    label: 'My Members',
    route: '/trainer/members',
    icon: Users,
    permission: PERMISSIONS.MEMBER_VIEW,
    group: 'Workspace',
  },
  {
    id: 'workouts_trainer',
    label: 'Workouts',
    route: '/trainer/workouts',
    icon: Dumbbell,
    permission: PERMISSIONS.WORKOUT_VIEW,
    group: 'Coaching',
  },
  {
    id: 'diets_trainer',
    label: 'Diet Plans',
    route: '/trainer/diets',
    icon: Apple,
    permission: PERMISSIONS.DIET_VIEW,
    group: 'Coaching',
  },
  {
    id: 'progress_trainer',
    label: 'Progress',
    route: '/trainer/progress',
    icon: Activity,
    permission: PERMISSIONS.PROGRESS_VIEW,
    group: 'Coaching',
  },

  // --- MEMBER ---
  {
    id: 'dash_member',
    label: 'My Dashboard',
    route: '/member/dashboard',
    icon: Home,
    permission: PERMISSIONS.DASHBOARD_MEMBER,
    group: 'Personal',
  },
  {
    id: 'membership_member',
    label: 'Membership',
    route: '/member/membership',
    icon: FileText,
    permission: PERMISSIONS.MEMBERSHIP_VIEW,
    group: 'Personal',
  },
  {
    id: 'payments_member',
    label: 'Payments',
    route: '/member/payments',
    icon: CreditCard,
    permission: PERMISSIONS.PAYMENT_VIEW,
    group: 'Personal',
  },
  {
    id: 'attendance_member',
    label: 'Attendance',
    route: '/member/attendance',
    icon: CalendarCheck,
    permission: PERMISSIONS.ATTENDANCE_VIEW,
    group: 'Personal',
  },
  {
    id: 'workouts_member',
    label: 'Workouts',
    route: '/member/workouts',
    icon: Dumbbell,
    permission: PERMISSIONS.WORKOUT_VIEW,
    group: 'Fitness',
  },
  {
    id: 'diet_member',
    label: 'Diet',
    route: '/member/diet',
    icon: Apple,
    permission: PERMISSIONS.DIET_VIEW,
    group: 'Fitness',
  },
  {
    id: 'progress_member',
    label: 'My Progress',
    route: '/member/progress',
    icon: Activity,
    permission: PERMISSIONS.PROGRESS_VIEW,
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
  { id: 'profile', label: 'Profile', route: '/settings/profile', icon: User, group: 'User' },
];

export const getNavForPermissions = (hasPermission: (p: Permission) => boolean): NavItem[] => {
  return NAVIGATION_CONFIG.filter((nav) => !nav.permission || hasPermission(nav.permission));
};
