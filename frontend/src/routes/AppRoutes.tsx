import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PlaceholderLayout = () => (
  <div className="min-h-screen bg-background p-4">
    <header className="mb-4 border-b pb-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-primary">GymOS</h1>
      <nav className="space-x-4">
        <span>Placeholder Nav</span>
      </nav>
    </header>
    <main>
      <Outlet />
    </main>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    // Return children directly for now so we can test the routes
    // In future, redirect to login
    // return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth">
          <Route path="login" element={<h2>Login (Placeholder)</h2>} />
          <Route path="forgot-password" element={<h2>Forgot Password (Placeholder)</h2>} />
          <Route path="reset-password" element={<h2>Reset Password (Placeholder)</h2>} />
        </Route>

        {/* Protected Routes inside Layout */}
        <Route element={<ProtectedRoute><PlaceholderLayout /></ProtectedRoute>}>
          
          {/* Admin / Branch Manager */}
          <Route path="/">
            <Route index element={<h2>Dashboard (Placeholder)</h2>} />
            <Route path="dashboard" element={<h2>Dashboard (Placeholder)</h2>} />
            <Route path="members" element={<h2>Members (Placeholder)</h2>} />
            <Route path="trainers" element={<h2>Trainers (Placeholder)</h2>} />
            <Route path="branches" element={<h2>Branches (Placeholder)</h2>} />
            <Route path="plans" element={<h2>Plans (Placeholder)</h2>} />
            <Route path="payments" element={<h2>Payments (Placeholder)</h2>} />
            <Route path="reports" element={<h2>Reports (Placeholder)</h2>} />
            <Route path="settings" element={<h2>Settings (Placeholder)</h2>} />
            <Route path="attendance" element={<h2>Attendance (Placeholder)</h2>} />
          </Route>

          {/* Trainer */}
          <Route path="/trainer">
            <Route path="dashboard" element={<h2>Trainer Dashboard (Placeholder)</h2>} />
            <Route path="members" element={<h2>Trainer Members (Placeholder)</h2>} />
            <Route path="workouts" element={<h2>Trainer Workouts (Placeholder)</h2>} />
            <Route path="diets" element={<h2>Trainer Diets (Placeholder)</h2>} />
            <Route path="progress" element={<h2>Trainer Progress (Placeholder)</h2>} />
            <Route path="sessions" element={<h2>Trainer Sessions (Placeholder)</h2>} />
          </Route>

          {/* Member */}
          <Route path="/member">
            <Route path="dashboard" element={<h2>Member Dashboard (Placeholder)</h2>} />
            <Route path="membership" element={<h2>Member Membership (Placeholder)</h2>} />
            <Route path="payments" element={<h2>Member Payments (Placeholder)</h2>} />
            <Route path="attendance" element={<h2>Member Attendance (Placeholder)</h2>} />
            <Route path="workouts" element={<h2>Member Workouts (Placeholder)</h2>} />
            <Route path="diet" element={<h2>Member Diet (Placeholder)</h2>} />
            <Route path="progress" element={<h2>Member Progress (Placeholder)</h2>} />
            <Route path="notifications" element={<h2>Member Notifications (Placeholder)</h2>} />
            <Route path="profile" element={<h2>Member Profile (Placeholder)</h2>} />
          </Route>

          {/* Error states */}
          <Route path="/403" element={<h2>403 - Not Authorized</h2>} />
          <Route path="*" element={<h2>404 - Not Found</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
