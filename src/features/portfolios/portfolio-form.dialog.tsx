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
import type { Portfolio, CreatePortfolioDto } from '@/types/portfolio';
import { useProjects } from '@/hooks/use-projects';

interface PortfolioFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreatePortfolioDto) => void;
    portfolio?: Portfolio | null;
    isLoading?: boolean;
}

export function PortfolioFormDialog({
    open,
    onOpenChange,
    onSubmit,
    portfolio,
    isLoading,
}: PortfolioFormDialogProps) {
    const { data: projects } = useProjects({ page: 1, limit: 100 });

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        setValue,
        watch,
    } = useForm<CreatePortfolioDto>({
        defaultValues: {
            nameEn: '',
            nameRu: '',
            nameUz: '',
            descriptionEn: '',
            descriptionRu: '',
            descriptionUz: '',
            imageUrls: [],
            projectId: '',
        },
    });

    const imageUrls = watch('imageUrls');
    const projectId = watch('projectId');

    useEffect(() => {
        if (portfolio) {
            reset({
                nameEn: portfolio.nameEn,
                nameRu: portfolio.nameRu,
                nameUz: portfolio.nameUz,
                descriptionEn: portfolio.descriptionEn,
                descriptionRu: portfolio.descriptionRu,
                descriptionUz: portfolio.descriptionUz,
                imageUrls: portfolio.imageUrls || [],
                projectId: portfolio.projectId,
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
                projectId: '',
            });
        }
    }, [portfolio, reset, open]);

    const handleFormSubmit = (data: CreatePortfolioDto) => {
        onSubmit(data);
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent
                className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>
                        {portfolio ? `Edit Portfolio: ${portfolio.nameEn}` : 'Add New Portfolio'}
                    </DialogTitle>
                    <DialogDescription>
                        {portfolio
                            ? 'Update the portfolio information in all languages.'
                            : 'Create a new portfolio with details in all supported languages.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Image Upload - Multiple */}
                    <div className="space-y-2">
                        <Label>Portfolio Images <span className="text-destructive">*</span></Label>
                        <ImageUpload
                            value={imageUrls}
                            onChange={(urls) => setValue('imageUrls', urls as string[], { shouldValidate: true, shouldDirty: true })}
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

                    {/* Project */}
                    <div className="space-y-2">
                        <Label htmlFor="projectId">
                            Project <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={projectId}
                            onValueChange={(value) => setValue('projectId', value, { shouldValidate: true, shouldDirty: true })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects?.data.map((project) => (
                                    <SelectItem key={project.id} value={project.id}>
                                        {project.nameEn}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <input
                            type="hidden"
                            {...register('projectId', { required: 'Project is required' })}
                        />
                        {errors.projectId && (
                            <p className="text-sm text-destructive">{errors.projectId.message}</p>
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
                                placeholder="Portfolio name in English"
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
                                placeholder="Portfolio nomi o'zbekcha"
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
                                placeholder="Portfolio description in English"
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
                                placeholder="Portfolio tavsifi o'zbekcha"
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
                            variant="outline"
                            onClick={handleClose}
                            className='cursor-pointer'
                            disabled={isLoading}
                        >
                            Close
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || (portfolio ? !isDirty : false)}
                            className='cursor-pointer'
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {portfolio ? 'Update Portfolio' : 'Create Portfolio'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}