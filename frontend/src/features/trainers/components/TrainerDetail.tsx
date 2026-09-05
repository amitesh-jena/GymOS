import { useParams, useNavigate } from 'react-router-dom';
import { useTrainer, useDeleteTrainer } from '../hooks/useTrainers';
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

export function TrainerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: trainer, isLoading, isError, refetch } = useTrainer(id || '');
  const deleteMutation = useDeleteTrainer();

  if (isLoading) return <LoadingState text="Loading trainer details..." />;
  if (isError || !trainer)
    return <ErrorState message="Trainer could not be found." onRetry={() => refetch()} />;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(trainer.id);
    navigate('/trainers');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/trainers')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-3">
            {trainer.firstName} {trainer.lastName}
            <Badge variant={trainer.status === 'ACTIVE' ? 'default' : 'outline'}>
              {trainer.status}
            </Badge>
          </h2>
          <p className="text-muted-foreground text-sm">ID: {trainer.id}</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => navigate(`/trainers/${trainer.id}/edit`)}
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
              <AlertDialogTitle>Delete Trainer</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {trainer.firstName}? This action will permanently
                remove their profile.
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
            <CardTitle className="text-lg">Contact & Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{trainer.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phone</p>
              <p className="font-medium">{trainer.phone}</p>
            </div>
            {trainer.specialization && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Specialization</p>
                <p className="font-medium">{trainer.specialization}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Trainer Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              (Future Phase: Assigned Members, Workouts, Schedule, Performance)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
