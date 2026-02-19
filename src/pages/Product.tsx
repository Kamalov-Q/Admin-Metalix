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
import { Plus, Pencil, Trash2, Search, Loader2, ImageIcon } from 'lucide-react';
import { formatDateTime, truncate } from '@/lib/utils';
import Pagination from '@/features/pagination';
import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import type { CreateProductDto, Product } from '@/types/products';
import { ProductFormDialog } from '@/features/products/product-form.dialog';
import { DeleteProductDialog } from '@/features/products/delete-product.dialog';

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const { data, isLoading } = useProducts({
        page,
        limit: 10,
        search: searchTerm,
        categoryId: categoryFilter === 'all' ? undefined : categoryFilter,
    });

    const { data: categories } = useCategories({ page: 1, limit: 100 });
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();

    const handleCreate = () => {
        setSelectedProduct(null);
        setFormOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setFormOpen(true);
    };

    const handleDelete = (product: Product) => {
        setSelectedProduct(product);
        setDeleteOpen(true);
    };

    const handleFormSubmit = (data: CreateProductDto) => {
        if (selectedProduct?.id) {
            updateMutation.mutate(
                { id: selectedProduct.id, data },
                {
                    onSuccess: () => {
                        setFormOpen(false);
                        setSelectedProduct(null);
                    },
                }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    setFormOpen(false);
                    setSelectedProduct(null);
                },
            });
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedProduct?.id) {
            deleteMutation.mutate(selectedProduct.id, {
                onSuccess: () => {
                    setDeleteOpen(false);
                    setSelectedProduct(null);
                },
            });
        }
    };

    // Helper to get first image URL
    const getFirstImage = (product: Product): string | undefined => {
        if (product.imageUrls && product.imageUrls.length > 0) {
            return product?.imageUrls[0];
        }
        return product?.imageUrls?.[0];
    };

    // Helper to get image count
    const getImageCount = (product: Product): number => {
        if (product.imageUrls) {
            return product.imageUrls.length;
        }
        return product.imageUrls ? 1 : 0;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your products with images and descriptions
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            <Card className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                    <div className="relative flex-1 w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={categoryFilter}
                        onValueChange={(value) => {
                            setCategoryFilter(value);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories?.data.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.nameEn}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : !data?.data.length ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            {searchTerm || categoryFilter !== 'all'
                                ? 'No products found matching your filters.'
                                : 'No products yet. Create your first one!'}
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
                                        <TableHead>Category</TableHead>
                                        <TableHead className="hidden xl:table-cell">Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.data?.map((product: Product) => {
                                        const firstImage = getFirstImage(product);
                                        const imageCount = getImageCount(product);

                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <div className="relative">
                                                        {firstImage ? (
                                                            <>
                                                                <img
                                                                    src={firstImage}
                                                                    alt={product.nameEn}
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
                                                        <p className="font-medium truncate">{product.nameEn}</p>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {truncate(product.descriptionEn, 40)}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="max-w-[200px]">
                                                        <p className="font-medium truncate">{product.nameRu}</p>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {truncate(product.descriptionRu, 40)}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <div className="max-w-[200px]">
                                                        <p className="font-medium truncate">{product.nameUz}</p>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {truncate(product.descriptionUz, 40)}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {product.category?.nameEn || '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm hidden xl:table-cell">
                                                    {formatDateTime(product.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(product)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(product)}
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
                            currentPage={page}
                        />
                    </>
                )}
            </Card>

            <ProductFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                onSubmit={handleFormSubmit}
                product={selectedProduct}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

            <DeleteProductDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDeleteConfirm}
                product={selectedProduct}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}