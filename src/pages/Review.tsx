import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Loader2, Eye, Star, Package, Check, X } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { useReviews, useUpdateReviewStatus } from '@/hooks/use-reviews';
import { ReviewDetailsDialog } from '@/features/reviews/review-details-dialog';
import type { Review, ReviewStatus } from '@/types/reviews';

const statusVariants: Record<ReviewStatus, 'warning' | 'success' | 'destructive'> = {
    PENDING: 'warning',
    ACCEPTED: 'success',
    REJECTED: 'destructive',
};

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center space-x-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-4 w-4 ${star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted-foreground'
                        }`}
                />
            ))}
        </div>
    );
}

export default function ReviewsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const { data: reviews, isLoading } = useReviews();
    const updateStatusMutation = useUpdateReviewStatus();

    const filteredReviews = reviews?.filter((review) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            review.fullName.toLowerCase().includes(searchLower) ||
            review.description.toLowerCase().includes(searchLower) ||
            review.product?.nameEn?.toLowerCase().includes(searchLower);
        const matchesStatus =
            statusFilter === 'all' ? true : review.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleView = (review: Review) => {
        setSelectedReview(review);
        setViewOpen(true);
    };

    const handleStatusChange = (id: string, status: ReviewStatus) => {
        updateStatusMutation.mutate({ id, dto: { status } });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
                    <p className="text-muted-foreground">
                        Manage customer product reviews
                    </p>
                </div>
                <Badge variant="secondary" className="text-base px-4 py-2">
                    {reviews?.length || 0}{' '}
                    {reviews?.length === 1 ? 'Review' : 'Reviews'}
                </Badge>
            </div>

            <Card className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                    <div className="relative flex-1 w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search reviews..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="ACCEPTED">Accepted</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : !filteredReviews?.length ? (
                    <div className="text-center py-12">
                        <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            {searchTerm || statusFilter !== 'all'
                                ? 'No reviews found matching your filters.'
                                : 'No reviews yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reviewer</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead className="hidden md:table-cell">Review</TableHead>
                                    <TableHead className="hidden lg:table-cell">Product</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden xl:table-cell">Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReviews.map((review) => (
                                    <TableRow key={review.id}>
                                        {/* Reviewer */}
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm font-medium text-primary">
                                                        {review.fullName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="font-medium truncate">
                                                    {review.fullName}
                                                </p>
                                            </div>
                                        </TableCell>

                                        {/* Rating */}
                                        <TableCell>
                                            <StarRating rating={review.rating} />
                                        </TableCell>

                                        {/* Review text */}
                                        <TableCell className="hidden md:table-cell max-w-[200px]">
                                            <p className="text-sm text-muted-foreground truncate">
                                                {review.description}
                                            </p>
                                        </TableCell>

                                        {/* Product */}
                                        <TableCell className="hidden lg:table-cell">
                                            {review.product ? (
                                                <div className="flex items-center space-x-2">
                                                    {review.product.imageUrl ? (
                                                        <img
                                                            src={review.product.imageUrl}
                                                            alt={review.product.nameEn}
                                                            className="w-8 h-8 object-cover rounded flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                                            <Package className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                                                        {review.product.nameEn}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">-</span>
                                            )}
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Badge variant={statusVariants?.ACCEPTED ? "default" : (statusVariants?.PENDING ? "secondary" : "destructive")}>
                                                {review.status}
                                            </Badge>
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell className="text-muted-foreground text-sm hidden xl:table-cell">
                                            {formatDateTime(review.createdAt)}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleView(review)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="ml-1 hidden sm:inline">View</span>
                                                </Button>
                                                {review.status === 'PENDING' && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => handleStatusChange(review.id, 'ACCEPTED')}
                                                            disabled={updateStatusMutation.isPending}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleStatusChange(review.id, 'REJECTED')}
                                                            disabled={updateStatusMutation.isPending}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Card>

            <ReviewDetailsDialog
                open={viewOpen}
                onOpenChange={setViewOpen}
                review={selectedReview}
            />
        </div>
    );
}