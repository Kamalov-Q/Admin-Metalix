import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
    url: string;
    fileName?: string;
}

export function PDFViewer({ url, fileName }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset: number) {
        setPageNumber((prevPageNumber) => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    function zoomIn() {
        setScale((prev) => Math.min(prev + 0.2, 2.0));
    }

    function zoomOut() {
        setScale((prev) => Math.max(prev - 0.2, 0.5));
    }

    function handleDownload() {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="flex flex-col space-y-4">
            {/* Controls */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={previousPage}
                        disabled={pageNumber <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        Page {pageNumber} of {numPages || '--'}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={pageNumber >= (numPages || 0)}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">{Math.round(scale * 100)}%</span>
                    <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 2.0}>
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="default" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button>
                </div>
            </div>

            {/* PDF Document */}
            <div className="border rounded-lg overflow-auto max-h-[600px] bg-gray-100 flex justify-center">
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex items-center justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    }
                    error={
                        <div className="p-4 text-center text-destructive">
                            Failed to load PDF. Please try downloading instead.
                        </div>
                    }
                >
                    <Page pageNumber={pageNumber} scale={scale} />
                </Document>
            </div>
        </div>
    );
}