import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateCategoryDto, Category } from '@/types/category';
import { Loader2, Package } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface CategoryFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateCategoryDto) => void;
    category?: Category | null;
    isLoading?: boolean;
}

export function CategoryFormDialog({
    open,
    onOpenChange,
    onSubmit,
    category,
    isLoading,
}: CategoryFormDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm<CreateCategoryDto>({
        defaultValues: {
            nameEn: category?.nameEn || '',
            nameRu: category?.nameRu || '',
            nameUz: category?.nameUz || '',
        },
    });

    useEffect(() => {

        if (!open) {
            reset({
                nameEn: '',
                nameRu: '',
                nameUz: ''
            });
            return;
        }

        if (category) {
            reset({
                nameEn: category.nameEn,
                nameRu: category.nameRu,
                nameUz: category.nameUz,
            });
        } else {
            reset({
                nameEn: '',
                nameRu: '',
                nameUz: '',
            });
        }
    }, [category, reset, open]);

    // Fetch products for this category
    const { data: productsData } = useProducts({
        page: 1,
        limit: 100,
        categoryId: category?.id
    }, {
        enabled: !!category?.id && open
    });

    const categoryProducts = productsData?.data || [];

    const handleFormSubmit = (data: CreateCategoryDto) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px] max-h-[85vh] flex flex-col"
                onInteractOutside={(e) => e?.preventDefault()}
                onEscapeKeyDown={(e) => e?.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>
                        {category ? `Edit Category ${category?.nameEn}` : 'Add Category'}
                    </DialogTitle>
                    <DialogDescription>
                        {category
                            ? 'Update the category information in all languages.'
                            : 'Create a new category with names in all supported languages.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)}
                    className="flex flex-col gap-4 flex-1 overflow-hidden"
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nameEn">
                                Name (English) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="nameEn"
                                placeholder="Enter category name in English"
                                {...register('nameEn', {
                                    required: 'English name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters',
                                    },
                                })}
                            />
                            {errors.nameEn && (
                                <p className="text-sm text-destructive">{errors.nameEn.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nameRu">
                                Name (Russian) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="nameRu"
                                placeholder="Введите название категории на русском"
                                {...register('nameRu', {
                                    required: 'Russian name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters',
                                    },
                                })}
                            />
                            {errors.nameRu && (
                                <p className="text-sm text-destructive">{errors.nameRu.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nameUz">
                                Name (Uzbek) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="nameUz"
                                placeholder="Kategoriya nomini o'zbekcha kiriting"
                                {...register('nameUz', {
                                    required: 'Uzbek name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters',
                                    },
                                })}
                            />
                            {errors.nameUz && (
                                <p className="text-sm text-destructive">{errors.nameUz.message}</p>
                            )}
                        </div>
                    </div>

                    {categoryProducts.length === 0 ? (
                        <div className="flex items-center justify-center border-2 border-dashed rounded-lg py-8 bg-muted/20">
                            <div className="text-center">
                                <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    No products in this category yet
                                </p>
                            </div>
                        </div>
                    ) : (
                        <ScrollArea className="w-full max-h-[220px] border rounded-lg bg-muted/20">
                            <div className="flex flex-col gap-2 w-full">
                                {categoryProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center w-full gap-3 p-3 bg-background border border-input rounded-lg hover:border-primary/50 transition-colors"
                                    >
                                        {/* Product Image */}
                                        <div className="flex-shrink-0 w-12 h-12">
                                            {product.imageUrls?.[0] ? (
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={product.imageUrls[0]}
                                                        alt={product.nameEn}
                                                        className="w-full h-full object-cover rounded-md border"
                                                    />
                                                    {product.imageUrls.length > 1 && (
                                                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                                            {product.imageUrls.length}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-full h-full bg-muted rounded-md border flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                    #{index + 1}
                                                </span>
                                                <p className="text-sm font-medium truncate" title={product.nameEn}>
                                                    {product.nameEn}
                                                </p>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate" title={product.descriptionEn}>
                                                {product.descriptionEn?.length > 20 ? `${product?.descriptionEn?.slice(0, 50)}...` : product?.descriptionEn}
                                            </p>
                                        </div>

                                        {/* Product Badge */}
                                        <Badge variant="outline" className="flex-shrink-0 ml-3 flex items-center">
                                            <Package className="h-3 w-3 mr-1" />
                                            Product
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}


                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            className='cursor-pointer'
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || (category ? !isDirty : false)} className='cursor-pointer'>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {category ? 'Update Category' : 'Create Category'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}