import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Search, Filter, Trash2 } from 'lucide-react';

export function ListArchitectureDemo() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Records</h2>
          <p className="text-muted-foreground text-sm">
            Manage data using standard list architecture.
          </p>
        </div>
        <Button>Create New</Button>
      </div>

      {/* Toolbar / Search / Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search records..." className="pl-8" />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status: All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
            [ Data Table Placeholder ]{/* Real implementation uses Shadcn Table + Pagination */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DestructiveActionDemo() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    setIsDeleting(true);
    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false);
      toast({
        title: 'Record Deleted',
        description: 'The requested record was permanently destroyed.',
        variant: 'success',
      });
    }, 1200);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border border-destructive/20 bg-destructive/5 rounded-md">
          <div>
            <h4 className="font-medium text-destructive">Delete Workspace</h4>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. All data will be lost.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  'Deleting...'
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this record and remove data from our servers. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Confirm Deletion
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
