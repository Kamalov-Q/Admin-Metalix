import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/types/pagination';

interface PaginationProps {
    meta?: PaginationMeta;
    length?: number;
    onPageChange?: (page: number) => void;
    currentPage?: number;
}

export default function Pagination({ meta, length, onPageChange, currentPage }: PaginationProps) {
    if (!meta) return null;

    const handlePrevious = () => {
        if (onPageChange && currentPage && meta.hasPreviousPage) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (onPageChange && currentPage && meta.hasNextPage) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
                Showing {length || 0} of {meta.total} items
            </p>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={!meta.hasPreviousPage}
                >
                    Previous
                </Button>
                <span className="text-sm">
                    Page {meta.page} of {meta.totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={!meta.hasNextPage}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}