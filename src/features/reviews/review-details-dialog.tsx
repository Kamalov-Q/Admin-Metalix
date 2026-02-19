import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, User, Calendar, Package, Check, X } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { useUpdateReviewStatus } from '@/hooks/use-reviews';
import type { Review, ReviewStatus } from '@/types/reviews';

interface ReviewDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    review: Review | null;
}

const statusVariants: Record<ReviewStatus, 'warning' | 'success' | 'destructive'> = {
    PENDING: 'warning',
    ACCEPTED: 'success',
    REJECTED: 'destructive',
};

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-5 w-5 ${star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted-foreground'
                        }`}
                />
            ))}
            <span className="ml-2 text-sm font-medium">{rating}/5</span>
        </div>
    );
}

export function ReviewDetailsDialog({
    open,
    onOpenChange,
    review,
}: ReviewDetailsDialogProps) {
    const updateStatusMutation = useUpdateReviewStatus();

    if (!review) return null;

    const handleStatusChange = (status: ReviewStatus) => {
        updateStatusMutation.mutate(
            { id: review.id, dto: { status } },
            { onSuccess: () => onOpenChange(false) }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Review Details</DialogTitle>
                    <DialogDescription>
                        Full information about this review
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Reviewer Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Reviewer</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start space-x-3">
                                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                    <p className="text-sm">{review.fullName}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Submitted On</p>
                                    <p className="text-sm">{formatDateTime(review.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Rating</h3>
                        <StarRating rating={review.rating} />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Review</h3>
                        <div className="rounded-lg bg-muted p-4">
                            <p className="text-sm whitespace-pre-wrap">{review.description}</p>
                        </div>
                    </div>

                    {/* Product Info */}
                    {review.product && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Product</h3>
                            <div className="flex items-center space-x-4 p-4 border rounded-lg bg-accent">
                                {review.product.imageUrls[0] ? (
                                    <img
                                        src={review.product.imageUrls[0]}
                                        alt={review.product.nameEn}
                                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                        <Package className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="font-medium">{review.product.nameEn}</p>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {review.product.descriptionEn}
                                    </p>
                                    {review.product.category && (
                                        <Badge variant="secondary" className="mt-1">
                                            {review.product.category.nameEn}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Status</h3>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                                <p className="text-sm text-muted-foreground">Current status:</p>
                                <Badge variant={statusVariants?.ACCEPTED ? "default" : (statusVariants?.PENDING ? "secondary" : "destructive")}>
                                    {review.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Action Buttons - only show if PENDING */}
                        {review.status === 'PENDING' && (
                            <div className="flex space-x-3">
                                <Button
                                    className="flex-1"
                                    variant="default"
                                    onClick={() => handleStatusChange('ACCEPTED')}
                                    disabled={updateStatusMutation.isPending}
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                </Button>
                                <Button
                                    className="flex-1"
                                    variant="destructive"
                                    onClick={() => handleStatusChange('REJECTED')}
                                    disabled={updateStatusMutation.isPending}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                </Button>
                            </div>
                        )}

                        {/* Re-action Buttons - show if already actioned */}
                        {review.status !== 'PENDING' && (
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => handleStatusChange('PENDING')}
                                disabled={updateStatusMutation.isPending}
                            >
                                Reset to Pending
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}