
import { useWorkspace } from '@/contexts/WorkspaceContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function TenantSelector() {
  const { availableTenants, activeTenant, setActiveTenant } = useWorkspace();

  if (!availableTenants || availableTenants.length === 0) {
    return null; // Return null if no context
  }

  if (availableTenants.length === 1) {
    return (
      <div className="text-sm font-medium text-foreground px-2 py-1">
        {activeTenant?.tenantName}
      </div>
    );
  }

  return (
    <Select
      value={activeTenant?.tenantId || undefined}
      onValueChange={(value) => setActiveTenant(value)}
    >
      <SelectTrigger className="w-[180px] h-8 text-sm focus:ring-0 focus:ring-offset-0 border-none bg-accent/40 hover:bg-accent/60">
        <SelectValue placeholder="Select Gym" />
      </SelectTrigger>
      <SelectContent>
        {availableTenants.map((t) => (
          <SelectItem key={t.tenantId} value={t.tenantId}>
            {t.tenantName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function BranchSelector() {
  const { availableBranches, activeBranch, setActiveBranch } = useWorkspace();

  if (!availableBranches || availableBranches.length === 0) {
    return null;
  }

  if (availableBranches.length === 1) {
    return (
      <div className="text-sm font-medium text-muted-foreground px-3 py-1 bg-accent/20 rounded-md">
        {activeBranch?.name}
      </div>
    );
  }

  return (
    <Select
      value={activeBranch?.branchId || undefined}
      onValueChange={(value) => setActiveBranch(value)}
    >
      <SelectTrigger className="w-[160px] h-8 text-sm focus:ring-0 focus:ring-offset-0 border border-border bg-background">
        <SelectValue placeholder="Select Branch" />
      </SelectTrigger>
      <SelectContent>
        {availableBranches.map((b) => (
          <SelectItem key={b.branchId} value={b.branchId}>
            {b.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
