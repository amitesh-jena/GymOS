import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '@/types/roles';
import { RequireAuth, RequireNoAuth, RequireRole, RedirectToRoleDashboard } from './Guards';
import { AppShell } from '@/components/layout/AppShell';
import React from 'react';
import { LoadingState } from '@/components/ux/LoadingState';

const lazyRoute = (
  factory: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>
) => {
  const LazyComponent = React.lazy(factory);
  return (props: Record<string, unknown>) => (
    <React.Suspense fallback={<LoadingState />}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};
import {
  NotFoundScreen,
  ForbiddenScreen,
  MaintenanceScreen,
} from '@/features/system/SystemScreens';
import { ListArchitectureDemo, DestructiveActionDemo } from '@/features/demo/PatternScreens';
import { AuthSimulator } from '@/features/auth/AuthSimulator';
import { DesignSystemShowcase } from '@/app/_DesignSystemShowcase';
import { SettingsLayout } from '@/features/settings/components/SettingsLayout';
import { ProfileSettingsView } from '@/features/settings/components/ProfileSettingsView';
import { AppearanceSettingsView } from '@/features/settings/components/AppearanceSettingsView';
import { SecuritySettingsView } from '@/features/settings/components/SecuritySettingsView';
import { TenantSettingsView } from '@/features/settings/components/TenantSettingsView';
import { MembersList } from '@/features/members/components/MembersList';
import { MemberDetail } from '@/features/members/components/MemberDetail';
const MemberForm = lazyRoute(() =>
  import('@/features/members/components/MemberForm').then((m) => ({ default: m.MemberForm }))
);
import { TrainersList } from '@/features/trainers/components/TrainersList';
import { TrainerDetail } from '@/features/trainers/components/TrainerDetail';
const TrainerForm = lazyRoute(() =>
  import('@/features/trainers/components/TrainerForm').then((m) => ({ default: m.TrainerForm }))
);
import { PaymentsList } from '@/features/payments/components/PaymentsList';
import { InvoicesList } from '@/features/invoices/components/InvoicesList';
import { ReceiptsList } from '@/features/receipts/components/ReceiptsList';
import { PlansList } from '@/features/plans/components/PlansList';
const PlanForm = lazyRoute(() =>
  import('@/features/plans/components/PlanForm').then((m) => ({ default: m.PlanForm }))
);
import { MembershipsList } from '@/features/memberships/components/MembershipsList';
const MembershipForm = lazyRoute(() =>
  import('@/features/memberships/components/MembershipForm').then((m) => ({
    default: m.MembershipForm,
  }))
);
import { AttendanceList } from '@/features/attendance/components/AttendanceList';
import { CheckInForm } from '@/features/attendance/components/CheckInForm';
import { MemberDashboard } from '@/features/member-dashboard/components/MemberDashboard';
import { MemberMembershipView } from '@/features/memberships/components/MemberMembershipView';
import { MemberPaymentsList } from '@/features/payments/components/MemberPaymentsList';
import { MemberAttendanceList } from '@/features/attendance/components/MemberAttendanceList';
import { MemberWorkoutsList } from '@/features/workouts/components/MemberWorkoutsList';
import { MemberDietView } from '@/features/diets/components/MemberDietView';
import { MemberProgressView } from '@/features/progress/components/MemberProgressView';
import { SubscriptionSettingsView } from '@/features/saas/components/SubscriptionSettingsView';
const AnalyticsDashboard = lazyRoute(() =>
  import('@/features/analytics/components/AnalyticsDashboard').then((m) => ({
    default: m.AnalyticsDashboard,
  }))
);
import { AdminTenantsList } from '@/features/saas/components/AdminTenantsList';
import { AdminTenantDetail } from '@/features/saas/components/AdminTenantDetail';
import { TrainerMembersList } from '@/features/trainers/components/TrainerMembersList';
const TrainerWorkoutsWorkspace = lazyRoute(() =>
  import('@/features/workouts/components/TrainerWorkoutsWorkspace').then((m) => ({
    default: m.TrainerWorkoutsWorkspace,
  }))
);

// Generic placeholder for mocked business screens
const PlaceholderScreen = ({ title }: { title: string }) => (
  <div className="p-2 sm:p-6 max-w-5xl mx-auto space-y-6">
    <div>
      <h2 className="text-secondary-foreground font-bold text-3xl tracking-tight">{title}</h2>
      <p className="text-muted-foreground mt-1">Architecture Placeholder View</p>
    </div>
    {/* If this is the dashboard, let's render the destructive pattern demo to showcase it */}
    {title.includes('Dashboard') && <DestructiveActionDemo />}
    <ListArchitectureDemo />
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Unauthenticated Routes */}
        <Route element={<RequireNoAuth />}>
          <Route path="/auth">
            <Route path="login" element={<AuthSimulator />} />
            <Route path="forgot-password" element={<div className="p-8">Forgot Password</div>} />
            <Route path="reset-password" element={<div className="p-8">Reset Password</div>} />
          </Route>
        </Route>

        {/* Development Route: Design System */}
        <Route path="/_design" element={<DesignSystemShowcase />} />

        {/* Global Error/System Routes */}
        <Route path="/403" element={<ForbiddenScreen />} />
        <Route path="/maintenance" element={<MaintenanceScreen />} />

        {/* Protected Authenticated Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            {/* Base Redirect */}
            <Route path="/" element={<RedirectToRoleDashboard />} />

            {/* General Authed Routes */}
            {/* General Authed Routes */}
            <Route path="/notifications" element={<PlaceholderScreen title="Notifications" />} />

            <Route path="/settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<ProfileSettingsView />} />
              <Route path="appearance" element={<AppearanceSettingsView />} />
              <Route path="security" element={<SecuritySettingsView />} />

              <Route element={<RequireRole allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER]} />}>
                <Route path="organization" element={<TenantSettingsView />} />
                <Route path="subscription" element={<SubscriptionSettingsView />} />
              </Route>
            </Route>

            {/* Owner / Admin Only Routes */}
            <Route
              element={
                <RequireRole
                  allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_MANAGER]}
                />
              }
            >
              <Route path="/trainers" element={<PlaceholderScreen title="Trainers" />} />
              <Route path="/reports" element={<AnalyticsDashboard />} />
            </Route>

            <Route element={<RequireRole allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER]} />}>
              <Route path="/branches" element={<PlaceholderScreen title="Gym Branches" />} />
              <Route path="/plans" element={<PlaceholderScreen title="Membership Plans" />} />
            </Route>

            {/* Platform Super Admin Only Routes */}
            <Route element={<RequireRole allowedRoles={[ROLES.SUPER_ADMIN]} />}>
              <Route path="/admin/tenants">
                <Route index element={<AdminTenantsList />} />
                <Route path=":id" element={<AdminTenantDetail />} />
              </Route>
            </Route>

            {/* Owner / Admin / Manager Branch Routes */}
            <Route
              element={
                <RequireRole
                  allowedRoles={[
                    ROLES.SUPER_ADMIN,
                    ROLES.OWNER,
                    ROLES.BRANCH_MANAGER,
                    ROLES.RECEPTIONIST,
                  ]}
                />
              }
            >
              <Route
                path="/dashboard"
                element={<PlaceholderScreen title="Management Dashboard" />}
              />
              <Route path="/members">
                <Route index element={<MembersList />} />
                <Route path="new" element={<MemberForm />} />
                <Route path=":id" element={<MemberDetail />} />
                <Route path=":id/edit" element={<MemberForm />} />
              </Route>
              <Route path="/trainers">
                <Route index element={<TrainersList />} />
                <Route path="new" element={<TrainerForm />} />
                <Route path=":id" element={<TrainerDetail />} />
                <Route path=":id/edit" element={<TrainerForm />} />
              </Route>
              <Route path="/plans">
                <Route index element={<PlansList />} />
                <Route path="new" element={<PlanForm />} />
                <Route path=":id/edit" element={<PlanForm />} />
              </Route>
              <Route path="/memberships">
                <Route index element={<MembershipsList />} />
                <Route path="assign" element={<MembershipForm />} />
                <Route path=":id/edit" element={<MembershipForm />} />
              </Route>
              <Route path="/attendance">
                <Route index element={<AttendanceList />} />
                <Route path="checkin" element={<CheckInForm />} />
              </Route>
              <Route path="/payments" element={<PaymentsList />} />
              <Route path="/invoices" element={<InvoicesList />} />
              <Route path="/receipts" element={<ReceiptsList />} />
            </Route>

            {/* Trainer Routes */}
            <Route path="/trainer" element={<RequireRole allowedRoles={[ROLES.TRAINER]} />}>
              <Route path="dashboard" element={<PlaceholderScreen title="Trainer Dashboard" />} />
              <Route path="members" element={<TrainerMembersList />} />
              <Route path="workouts" element={<TrainerWorkoutsWorkspace />} />
              <Route path="diets" element={<PlaceholderScreen title="Diet Plans" />} />
              <Route path="progress" element={<PlaceholderScreen title="Client Progress" />} />
              <Route path="sessions" element={<PlaceholderScreen title="My Coaching Sessions" />} />
            </Route>

            {/* Member Routes */}
            <Route path="/member" element={<RequireRole allowedRoles={[ROLES.MEMBER]} />}>
              <Route path="dashboard" element={<MemberDashboard />} />
              <Route path="membership" element={<MemberMembershipView />} />
              <Route path="payments" element={<MemberPaymentsList />} />
              <Route path="attendance" element={<MemberAttendanceList />} />
              <Route path="workouts" element={<MemberWorkoutsList />} />
              <Route path="diet" element={<MemberDietView />} />
              <Route path="progress" element={<MemberProgressView />} />
            </Route>

            {/* 404 Catch-All inside Chrome */}
            <Route path="*" element={<NotFoundScreen />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
