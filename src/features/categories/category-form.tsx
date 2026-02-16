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
import type { CreateCategoryDto, Category } from '@/types';
import { Loader2 } from 'lucide-react';

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
        formState: { errors },
        reset,
    } = useForm<CreateCategoryDto>({
        defaultValues: {
            nameEn: category?.nameEn || '',
            nameRu: category?.nameRu || '',
            nameUz: category?.nameUz || '',
        },
    });

    useEffect(() => {
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
    }, [category, reset]);

    const handleFormSubmit = (data: CreateCategoryDto) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>
                        {category ? 'Edit Category' : 'Add New Category'}
                    </DialogTitle>
                    <DialogDescription>
                        {category
                            ? 'Update the category information in all languages.'
                            : 'Create a new category with names in all supported languages.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {category ? 'Update Category' : 'Create Category'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}