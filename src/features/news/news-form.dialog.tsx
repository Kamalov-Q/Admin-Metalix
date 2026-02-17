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
import { ImageUpload } from '@/components/common/image-upload';
import { Loader2 } from 'lucide-react';
import type { News, CreateNewsDto } from '@/types/news';
import { queryClient } from '@/lib/query-client';

interface NewsFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateNewsDto) => void;
    news?: News | null;
    isLoading?: boolean;
}

export function NewsFormDialog({
    open,
    onOpenChange,
    onSubmit,
    news,
    isLoading,
}: NewsFormDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<CreateNewsDto>({
        defaultValues: {
            imageUrl: '',
            titleEn: '',
            titleRu: '',
            titleUz: '',
            contentEn: '',
            contentRu: '',
            contentUz: '',
            author: '',
        },
    });

    const imageUrl = watch('imageUrl');

    useEffect(() => {
        if (news) {
            reset({
                imageUrl: news.imageUrl,
                titleEn: news.titleEn,
                titleRu: news.titleRu,
                titleUz: news.titleUz,
                contentEn: news.contentEn,
                contentRu: news.contentRu,
                contentUz: news.contentUz,
                author: news.author,
            });
        } else {
            reset({
                imageUrl: '',
                titleEn: '',
                titleRu: '',
                titleUz: '',
                contentEn: '',
                contentRu: '',
                contentUz: '',
                author: '',
            });
        }
    }, [news, reset, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {news ? 'Edit News Article' : 'Add News Article'}
                    </DialogTitle>
                    <DialogDescription>
                        {news
                            ? 'Update the article in all languages.'
                            : 'Create a new article with content in all supported languages.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Image */}
                    <div className="space-y-2">
                        <Label>Article Image <span className="text-destructive">*</span></Label>
                        <ImageUpload
                            value={imageUrl}
                            onChange={(url) => {
                                setValue('imageUrl', url, { shouldValidate: true });
                                queryClient.invalidateQueries({ queryKey: ['news'] });
                            }}
                        />
                        <input
                            type="hidden"
                            {...register('imageUrl', { required: 'Image is required' })}
                        />
                        {errors.imageUrl && (
                            <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
                        )}
                    </div>

                    {/* Author */}
                    <div className="space-y-2">
                        <Label htmlFor="author">
                            Author <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="author"
                            placeholder="Article author name"
                            {...register('author', { required: 'Author is required' })}
                        />
                        {errors.author && (
                            <p className="text-sm text-destructive">{errors.author.message}</p>
                        )}
                    </div>

                    {/* Titles */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="titleEn">
                                Title (EN) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="titleEn"
                                placeholder="Title in English"
                                {...register('titleEn', { required: 'English title is required' })}
                            />
                            {errors.titleEn && (
                                <p className="text-sm text-destructive">{errors.titleEn.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="titleRu">
                                Title (RU) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="titleRu"
                                placeholder="Заголовок на русском"
                                {...register('titleRu', { required: 'Russian title is required' })}
                            />
                            {errors.titleRu && (
                                <p className="text-sm text-destructive">{errors.titleRu.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="titleUz">
                                Title (UZ) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="titleUz"
                                placeholder="Sarlavha o'zbekcha"
                                {...register('titleUz', { required: 'Uzbek title is required' })}
                            />
                            {errors.titleUz && (
                                <p className="text-sm text-destructive">{errors.titleUz.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Contents */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="contentEn">
                                Content (EN) <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="contentEn"
                                placeholder="Article content in English"
                                rows={4}
                                {...register('contentEn', { required: 'English content is required' })}
                            />
                            {errors.contentEn && (
                                <p className="text-sm text-destructive">{errors.contentEn.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contentRu">
                                Content (RU) <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="contentRu"
                                placeholder="Содержание на русском"
                                rows={4}
                                {...register('contentRu', { required: 'Russian content is required' })}
                            />
                            {errors.contentRu && (
                                <p className="text-sm text-destructive">{errors.contentRu.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contentUz">
                                Content (UZ) <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="contentUz"
                                placeholder="Kontent o'zbekcha"
                                rows={4}
                                {...register('contentUz', { required: 'Uzbek content is required' })}
                            />
                            {errors.contentUz && (
                                <p className="text-sm text-destructive">{errors.contentUz.message}</p>
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
                            {news ? 'Update Article' : 'Create Article'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}