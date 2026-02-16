import { Button } from "@/components/ui/button"
import type { Meta } from "@/types/pagination"
import { useState } from "react"

export type PaginationDataType = {
    meta: Meta,
    length: number;
}

const Pagination = ({ meta, length }: PaginationDataType) => {

    console.log(meta, 'Pagination data');

    const [page, setPage] = useState(0);

    return (
        <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
                Showing {length} of {meta?.total} categories
            </p>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={!meta.hasPreviousPage}
                >
                    Previous
                </Button>
                <span className="text-sm">
                    Page {page} of {meta.totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={!meta.hasNextPage}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

export default Pagination