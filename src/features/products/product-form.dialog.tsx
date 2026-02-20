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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/common/image-upload';
import { Loader2 } from 'lucide-react';
import type { CreateProductDto, Product } from '@/types/products';
import { useCategories } from '@/hooks/use-categories';

interface ProductFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateProductDto) => void;
    product?: Product | null;
    isLoading?: boolean;
}

export function ProductFormDialog({
    open,
    onOpenChange,
    onSubmit,
    product,
    isLoading,
}: ProductFormDialogProps) {
    const { data: categories } = useCategories({ page: 1, limit: 100 });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<CreateProductDto>({
        defaultValues: {
            nameEn: '',
            nameRu: '',
            nameUz: '',
            descriptionEn: '',
            descriptionRu: '',
            descriptionUz: '',
            imageUrls: [],
            categoryId: '',
        },
    });

    const imageUrls = watch('imageUrls');
    const categoryId = watch('categoryId');

    useEffect(() => {

        if (!open) {
            reset({
                nameEn: '',
                nameRu: '',
                nameUz: '',
                descriptionEn: '',
                descriptionRu: '',
                descriptionUz: '',
                imageUrls: [],
                categoryId: '',
            });
        }

        if (product) {
            reset({
                nameEn: product.nameEn,
                nameRu: product.nameRu,
                nameUz: product.nameUz,
                descriptionEn: product.descriptionEn,
                descriptionRu: product.descriptionRu,
                descriptionUz: product.descriptionUz,
                imageUrls: product.imageUrls ? product.imageUrls : (product.imageUrls || []),
                categoryId: product.categoryId,
            });
        } else {
            reset({
                nameEn: '',
                nameRu: '',
                nameUz: '',
                descriptionEn: '',
                descriptionRu: '',
                descriptionUz: '',
                imageUrls: [],
                categoryId: '',
            });
        }
    }, [product, reset, open]);

    const handleFormSubmit = (data: CreateProductDto) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {product ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                    <DialogDescription>
                        {product
                            ? 'Update the product information in all languages.'
                            : 'Create a new product with details in all supported languages.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Image Upload - Multiple */}
                    <div className="space-y-2">
                        <Label>Product Images <span className="text-destructive">*</span></Label>
                        <ImageUpload
                            value={imageUrls}
                            onChange={(urls) => setValue('imageUrls', urls as string[], { shouldValidate: true })}
                            multiple={true}
                            maxFiles={20}
                        />
                        <input
                            type="hidden"
                            {...register('imageUrls', {
                                required: 'At least one image is required',
                                validate: (value) => (value && value.length > 0) || 'At least one image is required'
                            })}
                        />
                        {errors.imageUrls && (
                            <p className="text-sm text-destructive">{errors.imageUrls.message}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="categoryId">
                            Category <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={categoryId}
                            onValueChange={(value) => setValue('categoryId', value, { shouldValidate: true })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.data.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.nameEn}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <input
                            type="hidden"
                            {...register('categoryId', { required: 'Category is required' })}
                        />
                        {errors.categoryId && (
                            <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                        )}
                    </div>

                    {/* Names */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nameEn">
                                Name (English) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="nameEn"
                                placeholder="Product name in English"
                                {...register('nameEn', {
                                    required: 'English name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
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
                                placeholder="Название на русском"
                                {...register('nameRu', {
                                    required: 'Russian name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
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
                                placeholder="Mahsulot nomi o'zbekcha"
                                {...register('nameUz', {
                                    required: 'Uzbek name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                })}
                            />
                            {errors.nameUz && (
                                <p className="text-sm text-destructive">{errors.nameUz.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="descriptionEn">
                                Description (English) <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="descriptionEn"
                                placeholder="Product description in English"
                                rows={3}
                                {...register('descriptionEn', {
                                    required: 'English description is required',
                                    minLength: { value: 10, message: 'Description must be at least 10 characters' },
                                })}
                            />
                            {errors.descriptionEn && (
                                <p className="text-sm text-destructive">{errors.descriptionEn.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descriptionRu">
                                Description (Russian) <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="descriptionRu"
                                placeholder="Описание на русском"
                                rows={3}
                                {...register('descriptionRu', {
                                    required: 'Russian description is required',
                                    minLength: { value: 10, message: 'Description must be at least 10 characters' },
                                })}
                            />
                            {errors.descriptionRu && (
                                <p className="text-sm text-destructive">{errors.descriptionRu.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descriptionUz">
                                Description (Uzbek) <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="descriptionUz"
                                placeholder="Mahsulot tavsifi o'zbekcha"
                                rows={3}
                                {...register('descriptionUz', {
                                    required: 'Uzbek description is required',
                                    minLength: { value: 10, message: 'Description must be at least 10 characters' },
                                })}
                            />
                            {errors.descriptionUz && (
                                <p className="text-sm text-destructive">{errors.descriptionUz.message}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            className='cursor-pointer'
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className='cursor-pointer'>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {product ? 'Update Product' : 'Create Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}