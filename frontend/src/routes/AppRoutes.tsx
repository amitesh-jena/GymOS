import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROLES } from '@/types/roles';
import { RequireAuth, RequireNoAuth, RequireRole, RedirectToRoleDashboard } from './Guards';
import { AppShell } from '@/components/layout/AppShell';
import {
  NotFoundScreen,
  ForbiddenScreen,
  MaintenanceScreen,
} from '@/features/system/SystemScreens';
import { ListArchitectureDemo, DestructiveActionDemo } from '@/features/demo/PatternScreens';
import { AuthSimulator } from '@/features/auth/AuthSimulator';
import { DesignSystemShowcase } from '@/app/_DesignSystemShowcase';

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
            <Route path="/profile" element={<PlaceholderScreen title="My Profile" />} />
            <Route path="/notifications" element={<PlaceholderScreen title="Notifications" />} />

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
              <Route path="/members" element={<PlaceholderScreen title="Members Directory" />} />
              <Route path="/attendance" element={<PlaceholderScreen title="Attendance Logs" />} />
              <Route path="/payments" element={<PlaceholderScreen title="Payments & Invoices" />} />
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
              <Route path="/reports" element={<PlaceholderScreen title="Analytics Reports" />} />
            </Route>

            <Route element={<RequireRole allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER]} />}>
              <Route path="/branches" element={<PlaceholderScreen title="Gym Branches" />} />
              <Route path="/plans" element={<PlaceholderScreen title="Membership Plans" />} />
              <Route path="/settings" element={<PlaceholderScreen title="Global Settings" />} />
            </Route>

            {/* Trainer Routes */}
            <Route path="/trainer" element={<RequireRole allowedRoles={[ROLES.TRAINER]} />}>
              <Route path="dashboard" element={<PlaceholderScreen title="Trainer Dashboard" />} />
              <Route path="members" element={<PlaceholderScreen title="My Assigned Members" />} />
              <Route path="workouts" element={<PlaceholderScreen title="Workout Programs" />} />
              <Route path="diets" element={<PlaceholderScreen title="Diet Plans" />} />
              <Route path="progress" element={<PlaceholderScreen title="Client Progress" />} />
              <Route path="sessions" element={<PlaceholderScreen title="My Coaching Sessions" />} />
            </Route>

            {/* Member Routes */}
            <Route path="/member" element={<RequireRole allowedRoles={[ROLES.MEMBER]} />}>
              <Route path="dashboard" element={<PlaceholderScreen title="Member Dashboard" />} />
              <Route path="membership" element={<PlaceholderScreen title="My Subscription" />} />
              <Route path="payments" element={<PlaceholderScreen title="My Payments" />} />
              <Route path="attendance" element={<PlaceholderScreen title="My Attendance" />} />
              <Route path="workouts" element={<PlaceholderScreen title="My Workouts" />} />
              <Route path="diet" element={<PlaceholderScreen title="My Diet Plan" />} />
              <Route path="progress" element={<PlaceholderScreen title="My Progress Tracking" />} />
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
