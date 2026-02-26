import { useState } from 'react';
import type { Review, ReviewStatus } from '@/types/reviews';
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
import { useProducts } from '@/hooks/use-products';
import { ReviewDetailsDialog } from '@/features/reviews/review-details.dialog';
import Pagination from '@/features/pagination';
import { useDebounce } from '@/hooks/use-debounce';

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
    const [page, setPage] = useState(1);
    const [fullNameSearch, setFullNameSearch] = useState('');
    const [productId, setProductId] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const debouncedSearch = useDebounce(fullNameSearch, 300);
    const effectiveSearch = debouncedSearch.length >= 3 ? debouncedSearch : '';

    const { data, isLoading } = useReviews({
        page,
        limit: 10,
        sortOrder: 'DESC',
        fullName: effectiveSearch || undefined,
        productId: productId === 'all' ? undefined : productId,
        status: statusFilter === 'all' ? undefined : statusFilter,
    });

    const { data: products } = useProducts({ page: 1, limit: 100 });
    const updateStatusMutation = useUpdateReviewStatus();

    const handleView = (review: Review) => {
        setSelectedReview(review);
        setViewOpen(true);
    };

    const handleStatusChange = (id: string, status: ReviewStatus) => {
        updateStatusMutation.mutate({ id, dto: { status } });
    };

    const handleClearSearch = () => {
        setFullNameSearch('');
        setPage(1);
    }

    const handleResetFilters = () => {
        setFullNameSearch('');
        setProductId('all');
        setStatusFilter('all');
        setPage(1);
    };

    const hasActiveFilters =
        fullNameSearch !== '' ||
        productId !== 'all' ||
        statusFilter !== 'all';

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
                    {data?.meta.total || 0}{' '}
                    {data?.meta.total === 1 ? 'Review' : 'Reviews'}
                </Badge>
            </div>

            <Card className="p-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                    <div className="relative flex-1 w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name..."
                            value={fullNameSearch}
                            onChange={(e) => {
                                setFullNameSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10"
                        />
                        {fullNameSearch && (
                            <button onClick={handleClearSearch} className='absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors' type="button">
                                <X className='h-4 w-4' />
                            </button>
                        )}
                    </div>
                    {fullNameSearch?.length > 0 && fullNameSearch?.length < 3 && (
                        <p className="mt-2 text-xs text-muted-foreground">
                            Enter {3 - fullNameSearch.length} more character
                            {3 - fullNameSearch.length > 1 ? 's' : ''} to start searching
                        </p>
                    )}
                    <Select
                        value={productId}
                        onValueChange={(value) => {
                            setProductId(value);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="All Products" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Products</SelectItem>
                            {products?.data.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                    {product.nameEn}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={statusFilter}
                        onValueChange={(value) => {
                            setStatusFilter(value);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Accepted</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilters}
                            className="text-muted-foreground hover:text-foreground whitespace-nowrap cursor-pointer"
                        >
                            Clear filters
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : !data?.data.length ? (
                    <div className="text-center py-12">
                        <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            {hasActiveFilters
                                ? 'No reviews found matching your filters.'
                                : 'No reviews yet.'}
                        </p>
                    </div>
                ) : (
                    <>
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
                                    {data.data.map((review) => (
                                        <TableRow key={review.id}>
                                            {/* Reviewer */}
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-medium text-primary">
                                                            {review.fullName.trim().charAt(0).toUpperCase()}
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
                                                {review?.product ? (
                                                    <div className="flex items-center space-x-2">
                                                        {review?.product?.imageUrls?.[0] ? (
                                                            <img
                                                                src={review?.product?.imageUrls?.[0]}
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
                                                <Badge>
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
                                                        className='cursor-pointer'
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
                                                                className="text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer"
                                                                onClick={() => handleStatusChange(review.id, 'ACCEPTED')}
                                                                disabled={updateStatusMutation.isPending}
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
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

                        <Pagination
                            meta={data?.meta}
                            length={data?.data?.length}
                            onPageChange={setPage}
                        />
                    </>
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