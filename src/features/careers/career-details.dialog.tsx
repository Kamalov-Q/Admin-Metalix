import { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileText, Mail, Phone, User, Calendar } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { useCareer } from '@/hooks/use-career';

interface CareerDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    careerId: string | null;
}

export function CareerDetailsDialog({
    open,
    onOpenChange,
    careerId,
}: CareerDetailsDialogProps) {
    const { data: career, isLoading, refetch } = useCareer(careerId || '', !!careerId && open);

    useEffect(() => {
        if (open && careerId) {
            refetch();
        }
    }, [open, careerId, refetch]);

    const handleDownload = () => {
        if (!career) return;

        const link = document.createElement('a');
        link.href = career.fileUrl;

        // Extract filename from URL or create one
        const urlParts = career.fileUrl.split('/');
        const filename = urlParts[urlParts.length - 1] ||
            `${career.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleViewResume = () => {
        if (!career) return;
        window.open(career.fileUrl, '_blank');
    };

    // Detect file type from URL
    const getFileType = (url: string): 'pdf' | 'doc' | 'unknown' => {
        const extension = url.split('.').pop()?.toLowerCase();
        if (extension === 'pdf') return 'pdf';
        if (extension === 'doc' || extension === 'docx') return 'doc';
        return 'unknown';
    };

    const fileType = career ? getFileType(career.fileUrl) : 'unknown';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Career Application Details</DialogTitle>
                    <DialogDescription>
                        Complete information about this application
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                ) : !career ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Failed to load application details</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Applicant Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Applicant Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start space-x-3">
                                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                        <p className="text-sm">{career.fullName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                                        <a
                                            href={`mailto:${career.email}`}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            {career.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                        <a
                                            href={`tel:${career.phoneNumber}`}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            {career.phoneNumber}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 md:col-span-2">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Applied On</p>
                                        <p className="text-sm">{formatDateTime(career.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resume */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Resume</h3>

                            <div className="flex items-center justify-between p-4 border rounded-lg bg-accent">
                                <div className="flex items-center space-x-3">
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            {career.fullName.replace(/\s+/g, '_')}_Resume
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {fileType === 'pdf' ? 'PDF Document' : fileType === 'doc' ? 'Word Document' : 'Document'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className='cursor-pointer'
                                        onClick={handleViewResume}
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        View
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className='cursor-pointer'
                                        onClick={handleDownload}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>

                            {/* Resume Preview - Only for PDFs */}
                            {fileType === 'pdf' && (
                                <div className="border rounded-lg overflow-hidden bg-gray-50">
                                    <iframe
                                        src={`${career.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                        className="w-full h-[500px]"
                                        title="Resume Preview"
                                    />
                                </div>
                            )}

                            {/* Message for DOC files */}
                            {fileType === 'doc' && (
                                <div className="p-4 border rounded-lg bg-blue-50 text-blue-800">
                                    <p className="text-sm">
                                        <strong>Note:</strong> Word documents cannot be previewed in the browser.
                                        Please download the file to view it.
                                    </p>
                                </div>
                            )}

                            {/* Message for unknown file types */}
                            {fileType === 'unknown' && (
                                <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-800">
                                    <p className="text-sm">
                                        <strong>Note:</strong> This file type cannot be previewed.
                                        Please download the file to view it.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}