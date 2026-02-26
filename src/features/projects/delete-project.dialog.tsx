import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import type { Project } from '@/types/project';

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  project: Project | null;
  isLoading?: boolean;
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  onConfirm,
  project,
  isLoading,
}: DeleteProjectDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the project{' '}
            <span className="font-semibold text-foreground">
              "{project?.nameEn}"
            </span>
            . This action cannot be undone.
            {project?.portfolios && project.portfolios.length > 0 && (
              <span className="block mt-2 text-destructive font-medium">
                Warning: This project has {project.portfolios.length} portfolio(s).
                Please remove them first before deleting this project.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className='cursor-pointer'>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}