import { useState } from "react";
import type { Career } from "@/types/career";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Search,
    Loader2,
    Eye,
    Download,
    Mail,
    Phone,
    FileText,
} from "lucide-react";

import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { useCareers } from "@/hooks/use-career";
import { CareerDetailsDialog } from "@/features/careers/career-details.dialog";

export default function CareersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);

    const { data: careers = [], isLoading } = useCareers();

    const filteredCareers = careers.filter((career) => {
        const searchLower = searchTerm.toLowerCase();

        return (
            career.fullName.toLowerCase().includes(searchLower) ||
            career.email.toLowerCase().includes(searchLower) ||
            career.phoneNumber.includes(searchLower) ||
            career.position.toLowerCase().includes(searchLower)
        );
    });

    const handleView = (careerId: string) => {
        setSelectedCareerId(careerId);
        setViewOpen(true);
    };

    const handleDownload = (career: Career) => {
        try {
            const link = document.createElement("a");
            link.href = career.resumeUrl;

            const urlParts = career.resumeUrl.split("/");
            const filename =
                urlParts[urlParts.length - 1] ||
                `${career.fullName.replace(/\s+/g, "_")}_Resume.pdf`;

            link.download = filename;
            link.target = "_blank";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Resume download started");
        } catch {
            toast.error("Failed to download resume");
        }
    };

    const getFileIcon = (url: string) => {
        const extension = url.split(".").pop()?.toLowerCase();
        if (extension === "pdf") return "📄";
        if (extension === "doc" || extension === "docx") return "📝";
        return "📎";
    };

    const getFileExtension = (url: string) =>
        url.split(".").pop()?.toUpperCase() || "FILE";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Career Applications
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage job applications
                    </p>
                </div>

                <Badge variant="secondary" className="text-base px-4 py-2">
                    {careers.length} Applications
                </Badge>
            </div>

            <Card className="p-4">
                {/* Search */}
                <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search applications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Loading */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : filteredCareers.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            {searchTerm
                                ? "No applications found matching your search."
                                : "No career applications yet."}
                        </p>
                    </div>
                ) : (
                    /* Table */
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Contact
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell">
                                        Resume
                                    </TableHead>
                                    <TableHead className="hidden xl:table-cell">
                                        Applied On
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredCareers.map((career) => (
                                    <TableRow key={career.id}>
                                        {/* Applicant */}
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm font-medium text-primary">
                                                        {career.fullName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="font-medium truncate">
                                                        {career.fullName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground md:hidden truncate">
                                                        {career.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Position */}
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className="whitespace-nowrap"
                                            >
                                                {career.position}
                                            </Badge>
                                        </TableCell>

                                        {/* Contact */}
                                        <TableCell className="hidden md:table-cell">
                                            <div className="space-y-1 min-w-0">
                                                <a
                                                    href={`mailto:${career.email}`}
                                                    className="flex items-center text-sm text-primary hover:underline truncate"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                                                    <span className="truncate">
                                                        {career.email}
                                                    </span>
                                                </a>

                                                <a
                                                    href={`tel:${career.phoneNumber}`}
                                                    className="flex items-center text-sm text-muted-foreground hover:text-primary"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                                                    {career.phoneNumber}
                                                </a>
                                            </div>
                                        </TableCell>

                                        {/* Resume */}
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xl">
                                                    {getFileIcon(career.resumeUrl)}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {getFileExtension(career.resumeUrl)}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                                            {formatDateTime(career.createdAt)}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleView(career.id)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="ml-2 hidden sm:inline">
                                                        View
                                                    </span>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDownload(career)}
                                                >
                                                    <Download className="h-4 w-4" />
                                                    <span className="ml-2 hidden sm:inline">
                                                        Download
                                                    </span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Card>

            {/* Details Dialog */}
            <CareerDetailsDialog
                open={viewOpen}
                onOpenChange={setViewOpen}
                careerId={selectedCareerId}
            />
        </div>
    );
}
