// src/pages/portfolios.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
import { Plus, Pencil, Trash2, Search, Loader2, ImageIcon, Briefcase, X } from 'lucide-react';
import { formatDateTime, truncate } from '@/lib/utils';
import Pagination from '@/features/pagination';
import { usePortfolios, useCreatePortfolio, useUpdatePortfolio, useDeletePortfolio } from '@/hooks/use-portfolios';
import { useProjects } from '@/hooks/use-projects';
import type { Portfolio, CreatePortfolioDto } from '@/types/portfolio';
import { useDebounce } from '@/hooks/use-debounce';
import { PortfolioFormDialog } from '@/features/portfolios/portfolio-form.dialog';
import { DeletePortfolioDialog } from '@/features/portfolios/delete-portfolio.dialog';

export default function PortfoliosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [projectFilter, setProjectFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

    const debouncedSearch = useDebounce(searchTerm, 500);
    const effectiveSearch = debouncedSearch.length >= 3 ? debouncedSearch : '';

    const { data, isLoading } = usePortfolios({
        page,
        limit: 10,
        search: effectiveSearch,
        projectId: projectFilter === 'all' ? undefined : projectFilter,
    });

    const { data: projects } = useProjects({ page: 1, limit: 100 });

    const createMutation = useCreatePortfolio();
    const updateMutation = useUpdatePortfolio();
    const deleteMutation = useDeletePortfolio();

    const handleCreate = () => {
        setSelectedPortfolio(null);
        setFormOpen(true);
    };

    const handleEdit = (portfolio: Portfolio) => {
        setSelectedPortfolio(portfolio);
        setFormOpen(true);
    };

    const handleDelete = (portfolio: Portfolio) => {
        setSelectedPortfolio(portfolio);
        setDeleteOpen(true);
    };

    const handleFormSubmit = (data: CreatePortfolioDto) => {
        if (selectedPortfolio?.id) {
            updateMutation.mutate(
                { id: selectedPortfolio.id, data },
                {
                    onSuccess: () => {
                        setFormOpen(false);
                        setSelectedPortfolio(null);
                    },
                }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    setFormOpen(false);
                    setSelectedPortfolio(null);
                },
            });
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedPortfolio?.id) {
            deleteMutation.mutate(selectedPortfolio.id, {
                onSuccess: () => {
                    setDeleteOpen(false);
                    setSelectedPortfolio(null);
                },
            });
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setPage(1);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setProjectFilter('all');
        setPage(1);
    };

    const hasActiveFilters = searchTerm !== '' || projectFilter !== 'all';

    const getSearchPlaceholder = () => {
        if (searchTerm.length > 0 && searchTerm.length < 3) {
            return `Type ${3 - searchTerm.length} more...`;
        }
        return 'Search portfolios (min 3 chars)...';
    };

    const getFirstImage = (portfolio: Portfolio): string | undefined => {
        return portfolio.imageUrls?.[0];
    };

    const getImageCount = (portfolio: Portfolio): number => {
        return portfolio.imageUrls?.length || 0;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Portfolios</h1>
                    <p className="text-muted-foreground">
                        Manage your portfolio items with images and descriptions
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Portfolio
                </Button>
            </div>

            <Card className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                    <div className="relative flex-1 w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={getSearchPlaceholder()}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10 pr-10"
                        />
                        {searchTerm && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <Select
                        value={projectFilter}
                        onValueChange={(value) => {
                            setProjectFilter(value);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="All Projects" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Projects</SelectItem>
                            {projects?.data.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.nameEn}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilters}
                            className="text-muted-foreground hover:text-foreground whitespace-nowrap"
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
                        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            {hasActiveFilters
                                ? 'No portfolios found matching your filters.'
                                : 'No portfolios yet. Create your first one!'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Images</TableHead>
                                        <TableHead>Name (EN)</TableHead>
                                        <TableHead className="hidden md:table-cell">Name (RU)</TableHead>
                                        <TableHead className="hidden lg:table-cell">Name (UZ)</TableHead>
                                        <TableHead>Project</TableHead>
                                        <TableHead className="hidden xl:table-cell">Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.data.map((portfolio: Portfolio) => {
                                        const firstImage = getFirstImage(portfolio);
                                        const imageCount = getImageCount(portfolio);

                                        return (
                                            <TableRow key={portfolio.id}>
                                                <TableCell>
                                                    <div className="relative">
                                                        {firstImage ? (
                                                            <>
                                                                <img
                                                                    src={firstImage}
                                                                    alt={portfolio.nameEn}
                                                                    className="w-16 h-16 object-cover rounded-md"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = '';
                                                                        e.currentTarget.style.display = 'none';
                                                                    }}
                                                                />
                                                                {imageCount > 1 && (
                                                                    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                                        {imageCount}
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                                                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-[200px]">
                                                        <p className="font-medium truncate">{portfolio.nameEn}</p>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {truncate(portfolio.descriptionEn, 40)}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="max-w-[200px]">
                                                        <p className="font-medium truncate">{portfolio.nameRu}</p>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {truncate(portfolio.descriptionRu, 40)}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <div className="max-w-[200px]">
                                                        <p className="font-medium truncate">{portfolio.nameUz}</p>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {truncate(portfolio.descriptionUz, 40)}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {portfolio.project?.nameEn || '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm hidden xl:table-cell">
                                                    {formatDateTime(portfolio.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            className='cursor-pointer'
                                                            size="sm"
                                                            onClick={() => handleEdit(portfolio)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className='cursor-pointer'
                                                            size="sm"
                                                            onClick={() => handleDelete(portfolio)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
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

            <PortfolioFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                onSubmit={handleFormSubmit}
                portfolio={selectedPortfolio}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

            <DeletePortfolioDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDeleteConfirm}
                portfolio={selectedPortfolio}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}