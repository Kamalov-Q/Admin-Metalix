// src/features/projects/project-form-dialog.tsx
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
import { Loader2, FolderKanban } from 'lucide-react';
import type { Project, CreateProjectDto } from '@/types/project';
import { usePortfolios } from '@/hooks/use-portfolios';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateProjectDto) => void;
    project?: Project | null;
    isLoading?: boolean;
}

export function ProjectFormDialog({
    open,
    onOpenChange,
    onSubmit,
    project,
    isLoading,
}: ProjectFormDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm<CreateProjectDto>({
        defaultValues: {
            nameEn: '',
            nameRu: '',
            nameUz: '',
        },
    });

    const { data: portfoliosData } = usePortfolios(
        { projectId: project?.id, page: 1, limit: 100 },
        { enabled: !!project?.id && open }
    );

    const projectPortfolios = portfoliosData?.data || [];

    useEffect(() => {
        if (project) {
            reset({
                nameEn: project.nameEn,
                nameRu: project.nameRu,
                nameUz: project.nameUz,
            });
        } else {
            reset({
                nameEn: '',
                nameRu: '',
                nameUz: '',
            });
        }
    }, [project, reset, open]);

    const handleFormSubmit = (data: CreateProjectDto) => {
        onSubmit(data);
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent
                className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FolderKanban className="h-5 w-5 text-primary" />
                        {project ? `Edit Project: ${project.nameEn}` : 'Add New Project'}
                    </DialogTitle>
                    <DialogDescription>
                        {project
                            ? 'Update the project name in all supported languages.'
                            : 'Create a new project with names in all languages.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
                    <ScrollArea className="flex-1 overflow-hidden">
                        <div className="pr-4 space-y-4">
                            {/* Project Names */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nameEn">
                                        Name (English) <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="nameEn"
                                        placeholder="Project name in English"
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
                                        placeholder="Loyiha nomi o'zbekcha"
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

                            {/* Portfolios in this Project */}
                            {project && (
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="text-base font-semibold flex items-center gap-2">
                                            <FolderKanban className="h-4 w-4 text-primary" />
                                            Portfolios in this Project
                                        </Label>
                                        <Badge variant="secondary" className="text-xs">
                                            {projectPortfolios.length} {projectPortfolios.length === 1 ? 'Portfolio' : 'Portfolios'}
                                        </Badge>
                                    </div>

                                    {projectPortfolios.length === 0 ? (
                                        <div className="border-2 border-dashed rounded-lg py-8 bg-muted/20">
                                            <div className="text-center">
                                                <FolderKanban className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground">
                                                    No portfolios in this project yet
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border rounded-lg bg-muted/20 max-h-64">
                                            <ScrollArea className="h-full">
                                                <div className="p-4 space-y-2">
                                                    {projectPortfolios.map((portfolio, index) => (
                                                        <div
                                                            key={portfolio.id}
                                                            className="flex items-center gap-3 p-3 bg-background rounded-lg border hover:border-primary/50 transition-colors"
                                                        >
                                                            {/* Portfolio Image */}
                                                            <div className="flex-shrink-0">
                                                                {portfolio.imageUrls && portfolio.imageUrls[0] ? (
                                                                    <div className="relative">
                                                                        <img
                                                                            src={portfolio.imageUrls[0]}
                                                                            alt={portfolio.nameEn}
                                                                            className="w-12 h-12 object-cover rounded-md border"
                                                                        />
                                                                        {portfolio.imageUrls.length > 1 && (
                                                                            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                                                                {portfolio.imageUrls.length}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-12 h-12 bg-muted rounded-md border flex items-center justify-center">
                                                                        <FolderKanban className="h-5 w-5 text-muted-foreground" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Portfolio Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                                        #{index + 1}
                                                                    </span>
                                                                    <p className="text-sm font-medium truncate">
                                                                        {portfolio.nameEn}
                                                                    </p>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground truncate">
                                                                    {portfolio.descriptionEn}
                                                                </p>
                                                            </div>

                                                            <Badge variant="outline" className="flex-shrink-0">
                                                                <FolderKanban className="h-3 w-3 mr-1" />
                                                                Portfolio
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <DialogFooter className="mt-6 flex-shrink-0">
                        <Button
                            type="button"
                            className='cursor-pointer'
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Close
                        </Button>
                        <Button
                            type="submit"
                            className='cursor-pointer'
                            disabled={isLoading || (project ? !isDirty : false)}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {project ? 'Update Project' : 'Create Project'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}