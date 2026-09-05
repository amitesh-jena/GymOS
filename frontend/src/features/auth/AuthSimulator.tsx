import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES, Role } from '@/types/roles';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function AuthSimulator() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSimulateLogin = (role: Role) => {
    login('mock-token', {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      name: `Mock ${role} User`,
      role: role,
      tenantId: 'tnt-gym-001',
    });
    // RequireAuth / RedirectToRoleDashboard will automatically catch and route correctly
    // depending on where they wanted to go, but since this is manual, we will navigate to `/` to let Guard handle redirect.
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-primary font-bold">GymOS</CardTitle>
          <CardDescription>Authentication Simulator (Phase 3)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col">
          <Button onClick={() => handleSimulateLogin(ROLES.SUPER_ADMIN)} variant="outline">
            Login as Super Admin
          </Button>
          <Button onClick={() => handleSimulateLogin(ROLES.OWNER)} variant="default">
            Login as Gym Owner
          </Button>
          <Button onClick={() => handleSimulateLogin(ROLES.BRANCH_MANAGER)} variant="secondary">
            Login as Branch Manager
          </Button>
          <Button onClick={() => handleSimulateLogin(ROLES.RECEPTIONIST)} variant="secondary">
            Login as Receptionist
          </Button>
          <Button onClick={() => handleSimulateLogin(ROLES.TRAINER)} variant="outline">
            Login as Trainer
          </Button>
          <Button onClick={() => handleSimulateLogin(ROLES.MEMBER)} variant="outline">
            Login as Member
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
