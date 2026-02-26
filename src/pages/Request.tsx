import { useState } from 'react';
import type { Request, RequestStatus } from '@/types/requests';
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
import {
    Search,
    Loader2,
    Eye,
    Package,
    Check,
    X,
    RotateCcw,
    MessageSquare,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { useRequests, useUpdateRequestStatus } from '@/hooks/use-requests';
import { useProducts } from '@/hooks/use-products';
import Pagination from '@/features/pagination';
import { RequestDetailsDialog } from '@/features/requests/request-detail.dialog';
import { useDebounce } from '@/hooks/use-debounce';

export default function RequestsPage() {
    const [page, setPage] = useState(1);
    const [fullNameSearch, setFullNameSearch] = useState('');
    const [productId, setProductId] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] =
        useState<Request | null>(null);

    const debouncedSearch = useDebounce(fullNameSearch, 300);
    const effectiveSearch = debouncedSearch?.length >= 3 ? debouncedSearch : "";

    const { data, isLoading } = useRequests({
        page,
        limit: 10,
        sortOrder: 'DESC',
        fullName: effectiveSearch || undefined,
        productId: productId === 'all' ? undefined : productId,
        status: statusFilter === 'all' ? undefined : statusFilter,
    });

    const { data: products } = useProducts({
        page: 1,
        limit: 100,
    });

    const updateStatusMutation = useUpdateRequestStatus();

    const handleView = (request: Request) => {
        setSelectedRequest(request);
        setViewOpen(true);
    };

    const handleStatusChange = (
        id: string,
        status: RequestStatus
    ) => {
        updateStatusMutation.mutate({ id, dto: { status } });
    };

    const handleResetFilters = () => {
        setFullNameSearch('');
        setProductId('all');
        setStatusFilter('all');
        setPage(1);
    };

    const handleClearSearch = () => {
        setFullNameSearch('');
        setPage(1);
    }

    const hasActiveFilters =
        fullNameSearch !== '' ||
        productId !== 'all' ||
        statusFilter !== 'all';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Requests
                    </h1>
                    <p className="text-muted-foreground">
                        Manage customer product requests
                    </p>
                </div>

                <Badge variant="secondary" className="text-base px-4 py-2">
                    {data?.meta.total || 0}{' '}
                    {data?.meta.total === 1 ? 'Request' : 'Requests'}
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
                                <SelectItem
                                    key={product.id}
                                    value={product.id}
                                >
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
                            <SelectItem value="ACCEPTED">
                                Accepted
                            </SelectItem>
                            <SelectItem value="REJECTED">
                                Rejected
                            </SelectItem>
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

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : !data?.data.length ? (
                    <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            {hasActiveFilters
                                ? 'No requests found matching your filters.'
                                : 'No requests yet.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Phone
                                        </TableHead>
                                        <TableHead className="hidden lg:table-cell">
                                            Product
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden xl:table-cell">
                                            Date
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {data.data.map((request) => (
                                        <TableRow key={request.id}>
                                            {/* Customer */}
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-primary">
                                                            {request.fullName
                                                                .trim()
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium truncate">
                                                            {request.fullName}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground md:hidden">
                                                            {request.phoneNumber}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Phone */}
                                            <TableCell className="hidden md:table-cell">
                                                <a
                                                    href={`tel:${request.phoneNumber}`}
                                                    className="text-sm text-primary hover:underline"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    {request.phoneNumber}
                                                </a>
                                            </TableCell>

                                            {/* Product */}
                                            <TableCell className="hidden lg:table-cell">
                                                {request?.product ? (
                                                    <div className="flex items-center space-x-2">
                                                        {request?.product?.imageUrls?.[0] ? (
                                                            <img
                                                                src={request?.product?.imageUrls?.[0]}
                                                                alt={request.product.nameEn}
                                                                className="w-8 h-8 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <span className="text-sm text-muted-foreground truncate max-w-[140px]">
                                                            {request.product.nameEn}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                <Badge
                                                >
                                                    {request.status}
                                                </Badge>
                                            </TableCell>

                                            {/* Date */}
                                            <TableCell className="text-muted-foreground text-sm hidden xl:table-cell">
                                                {formatDateTime(
                                                    request.createdAt
                                                )}
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        className='cursor-pointer'
                                                        size="sm"
                                                        onClick={() =>
                                                            handleView(request)
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span className="ml-1 hidden sm:inline">
                                                            View
                                                        </span>
                                                    </Button>

                                                    {request.status ===
                                                        'PENDING' && (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            request.id,
                                                                            'PENDING'
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updateStatusMutation.isPending
                                                                    }
                                                                >
                                                                    <RotateCcw className="h-4 w-4" />
                                                                </Button>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer"
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            request.id,
                                                                            'ACCEPTED'
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updateStatusMutation.isPending
                                                                    }
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            request.id,
                                                                            'REJECTED'
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updateStatusMutation.isPending
                                                                    }
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
                            meta={data.meta}
                            length={data.data.length}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </Card>

            <RequestDetailsDialog
                open={viewOpen}
                onOpenChange={setViewOpen}
                request={selectedRequest}
            />
        </div>
    );
}
