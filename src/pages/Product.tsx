import { useState } from 'react';
import type { Product, CreateProductDto } from '@/types/entities';
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
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { formatDateTime, truncate } from '@/lib/utils';
import Pagination from '@/features/pagination';
import {
    useProducts,
    useCategories,
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
} from '@/hooks';
import { DeleteProductDialog } from '@/features/products/delete-product.dialog';
import { ProductFormDialog } from '@/features/products/product-form';

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const { data, isLoading } = useProducts({
        page,
        limit: 10,
        search: searchTerm,
        categoryId: categoryFilter || undefined,
    });

    const { data: categories } = useCategories({ page: 1, limit: 1000 });
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
                            <SelectItem value="">All Categories</SelectItem>
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
                            {searchTerm || categoryFilter
                                ? 'No products found matching your filters.'
                                : 'No products yet. Create your first one!'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Image</TableHead>
                                        <TableHead>English</TableHead>
                                        <TableHead>Russian</TableHead>
                                        <TableHead>Uzbek</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.data.map((product: Product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.nameEn}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{product.nameEn}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {truncate(product.descriptionEn, 50)}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{product.nameRu}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {truncate(product.descriptionRu, 50)}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{product.nameUz}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {truncate(product.descriptionUz, 50)}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {product.category?.nameEn || '-'}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
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
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <Pagination meta={data?.meta} length={data?.data?.length} />
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