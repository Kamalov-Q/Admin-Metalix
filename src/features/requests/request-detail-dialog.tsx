import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    User,
    Phone,
    Calendar,
    Package,
    Check,
    X,
    Clock,
    RotateCcw,
} from 'lucide-react';
import type { Request, RequestStatus } from '@/types/requests';
import { formatDateTime } from '@/lib/utils';
import { useUpdateRequestStatus } from '@/hooks/use-requests';

interface RequestDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    request: Request | null;
}

const statusIcons: Record<RequestStatus, React.ReactNode> = {
    PENDING: <Clock className="h-4 w-4" />,
    ACCEPTED: <RotateCcw className="h-4 w-4" />,
    REJECTED: <X className="h-4 w-4" />,
};

export function RequestDetailsDialog({
    open,
    onOpenChange,
    request,
}: RequestDetailsDialogProps) {
    const updateStatusMutation = useUpdateRequestStatus();

    if (!request) return null;

    const handleStatusChange = (status: RequestStatus) => {
        updateStatusMutation.mutate(
            { id: request.id, dto: { status } },
            {
                onSuccess: () => onOpenChange(false),
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Request Details</DialogTitle>
                    <DialogDescription>
                        Full information about this product request
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Customer Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div className="flex items-start space-x-3">
                                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Full Name
                                    </p>
                                    <p className="text-sm">{request.fullName}</p>
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="flex items-start space-x-3">
                                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Phone Number
                                    </p>
                                    <a
                                        href={`tel:${request.phoneNumber}`}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {request.phoneNumber}
                                    </a>
                                </div>
                            </div>

                            {/* Requested On */}
                            <div className="flex items-start space-x-3 md:col-span-2">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Requested On
                                    </p>
                                    <p className="text-sm">
                                        {formatDateTime(request.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    {request.product && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Requested Product</h3>

                            <div className="flex items-center space-x-4 p-4 border rounded-lg bg-accent">
                                {request.product.imageUrl ? (
                                    <img
                                        src={request.product.imageUrl}
                                        alt={request.product.nameEn}
                                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                        <Package className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}

                                <div className="min-w-0 space-y-1">
                                    <p className="font-semibold">{request.product.nameEn}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {request.product.nameRu}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {request.product.nameUz}
                                    </p>

                                    {request.product.category && (
                                        <Badge variant="secondary" className="mt-1">
                                            {request.product.category.nameEn}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status Section */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Status Management</h3>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                Current status:
                            </p>
                            <Badge>
                                <span className="flex items-center gap-1.5">
                                    {statusIcons[request.status]}
                                    {request.status}
                                </span>
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant={request.status === 'PENDING' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleStatusChange('PENDING')}
                                disabled={
                                    request.status === 'PENDING' ||
                                    updateStatusMutation.isPending
                                }
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                Pending
                            </Button>

                            <Button
                                variant={request.status === 'ACCEPTED' ? 'default' : 'outline'}
                                size="sm"
                                className={
                                    request.status !== 'ACCEPTED'
                                        ? 'text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50'
                                        : ''
                                }
                                onClick={() => handleStatusChange('ACCEPTED')}
                                disabled={
                                    request.status === 'ACCEPTED' ||
                                    updateStatusMutation.isPending
                                }
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Completed
                            </Button>

                            <Button
                                variant={
                                    request.status === 'REJECTED'
                                        ? 'destructive'
                                        : 'outline'
                                }
                                size="sm"
                                className={
                                    request.status !== 'REJECTED'
                                        ? 'text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10'
                                        : ''
                                }
                                onClick={() => handleStatusChange('REJECTED')}
                                disabled={
                                    request.status === 'REJECTED' ||
                                    updateStatusMutation.isPending
                                }
                            >
                                <X className="h-4 w-4 mr-2" />
                                Rejected
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
