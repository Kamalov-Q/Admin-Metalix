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
import type { Portfolio } from '@/types/portfolio';

interface DeletePortfolioDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    portfolio: Portfolio | null;
    isLoading?: boolean;
}

export function DeletePortfolioDialog({
    open,
    onOpenChange,
    onConfirm,
    portfolio,
    isLoading,
}: DeletePortfolioDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the portfolio{' '}
                        <span className="font-semibold text-foreground">
                            "{portfolio?.nameEn}"
                        </span>
                        . This action cannot be undone.
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
                        Delete Portfolio
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}