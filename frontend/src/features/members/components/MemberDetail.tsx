import { useParams, useNavigate } from 'react-router-dom';
import { useMember, useDeleteMember } from '../hooks/useMembers';
import { LoadingState } from '@/components/ux/LoadingState';
import { ErrorState } from '@/components/ux/ErrorState';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
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

export function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: member, isLoading, isError, refetch } = useMember(id || '');
  const deleteMutation = useDeleteMember();

  if (isLoading) return <LoadingState text="Loading member details..." />;
  if (isError || !member)
    return <ErrorState message="Member could not be found." onRetry={() => refetch()} />;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(member.id);
    navigate('/members');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/members')}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to members</span>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-3">
            {member.firstName} {member.lastName}
            <Badge variant={member.status === 'ACTIVE' ? 'default' : 'outline'}>
              {member.status}
            </Badge>
          </h2>
          <p className="text-muted-foreground text-sm">ID: {member.id}</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => navigate(`/members/${member.id}/edit`)}
        >
          <Edit className="h-4 w-4" /> Edit
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Member</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {member.firstName}? This action cannot be undone and
                will permanently remove this member's data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90 transition-colors"
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{member.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phone</p>
              <p className="font-medium">{member.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Join Date</p>
              <p className="font-medium">{new Date(member.joinDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Overview Placeholder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              (Future Phase: Memberships, Attendance, Workouts, Payments)
            </p>
            {member.notes && (
              <div className="p-4 bg-muted/30 rounded-md border text-sm">
                <span className="font-semibold block mb-1">Notes:</span>
                {member.notes}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
