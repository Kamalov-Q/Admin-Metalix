import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories';
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
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils';
import { CategoryFormDialog } from '@/features/categories/category-form.dialog';
import { DeleteCategoryDialog } from '@/features/categories/delete-category.dialog';
import Pagination from '@/features/pagination';
import type { Category, CreateCategoryDto } from '@/types/category';

export default function CategoriesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['categories', { page, limit: 10, search: searchTerm }],
        queryFn: () =>
            categoriesApi.getAll({
                page,
                limit: 10,
                search: searchTerm,
            }),
    });

    const createMutation = useMutation({
        mutationFn: categoriesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully!');
            setFormOpen(false);
            setSelectedCategory(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create category');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateCategoryDto }) =>
            categoriesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category updated successfully!');
            setFormOpen(false);
            setSelectedCategory(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update category');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: categoriesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category deleted successfully!');
            setDeleteOpen(false);
            setSelectedCategory(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        },
    });

    const handleCreate = () => {
        setSelectedCategory(null);
        setFormOpen(true);
    };

    const handleEdit = (category: any) => {
        setSelectedCategory(category);
        setFormOpen(true);
    };

    const handleDelete = (category: any) => {
        setSelectedCategory(category);
        setDeleteOpen(true);
    };

    const handleFormSubmit = (data: CreateCategoryDto) => {
        if (selectedCategory?.id) {
            updateMutation.mutate({ id: selectedCategory.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedCategory?.id) {
            deleteMutation.mutate(selectedCategory.id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">
                        Manage your product categories in multiple languages
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            <Card className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : !data?.data.length ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            {searchTerm ? 'No categories found matching your search.' : 'No categories yet. Create your first one!'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>English</TableHead>
                                        <TableHead>Russian</TableHead>
                                        <TableHead>Uzbek</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.data.map((category: any) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="text-muted-foreground font-medium">
                                                {category.nameEn}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground font-medium">
                                                {category.nameRu}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground font-medium">
                                                {category.nameUz}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground font-medium text-sm">
                                                {formatDateTime(category.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(category)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(category)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <Pagination meta={data?.meta} length={data?.data?.length} />
                    </>
                )}
            </Card>

            {/* Form Dialog */}
            <CategoryFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                onSubmit={handleFormSubmit}
                category={selectedCategory}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

            {/* Delete Dialog */}
            <DeleteCategoryDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDeleteConfirm}
                category={selectedCategory}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}