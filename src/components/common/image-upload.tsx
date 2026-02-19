import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUploadImage } from '@/hooks/use-upload';

interface ImageUploadProps {
    value?: string | string[];
    onChange: (url: string | string[]) => void;
    onRemove?: (url?: string) => void;
    className?: string;
    disabled?: boolean;
    multiple?: boolean;
    maxFiles?: number;
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    className,
    disabled,
    multiple = false,
    maxFiles = 20,
}: ImageUploadProps) {
    const [previews, setPreviews] = useState<string[]>([]);
    const uploadMutation = useUploadImage();

    // Initialize previews from value
    useEffect(() => {
        if (value) {
            const urls = Array.isArray(value) ? value : [value];
            setPreviews(urls.filter(Boolean));
        } else {
            setPreviews([]);
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        // Check max files limit for multiple upload
        if (multiple && previews.length + files.length > maxFiles) {
            alert(`You can only upload up to ${maxFiles} images`);
            return;
        }

        // Validate all files
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        for (const file of files) {
            if (!validTypes.includes(file.type)) {
                alert('Only JPEG, PNG, and WEBP images are allowed');
                return;
            }
            if (file.size > maxSize) {
                alert(`Image "${file.name}" size must be less than 10MB`);
                return;
            }
        }

        // Show previews
        const readers = files.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then(newPreviews => {
            const updatedPreviews = multiple
                ? [...previews, ...newPreviews]
                : newPreviews;
            setPreviews(updatedPreviews);
        });

        // Upload to S3
        uploadMutation.mutate(files, {
            onSuccess: (urls) => {
                if (multiple) {
                    const existingUrls = Array.isArray(value) ? value : (value ? [value] : []);
                    const allUrls = [...existingUrls, ...urls];
                    onChange(allUrls);
                    setPreviews(allUrls);
                } else {
                    onChange(urls[0]);
                    setPreviews([urls[0]]);
                }
            },
            onError: () => {
                setPreviews(prev => multiple ? prev.slice(0, -files.length) : []);
            },
        });

        // Reset input
        e.target.value = '';
    };

    const handleRemove = (urlToRemove?: string) => {
        if (multiple && urlToRemove) {
            const filtered = previews.filter(url => url !== urlToRemove);
            setPreviews(filtered);
            onChange(filtered);
            if (onRemove) {
                onRemove(urlToRemove);
            }
        } else {
            setPreviews([]);
            onChange(multiple ? [] : '');
            if (onRemove) {
                onRemove();
            }
        }
    };

    const hasImages = previews.length > 0;
    const canAddMore = !multiple || previews.length < maxFiles;

    return (
        <div className={cn('space-y-3', className)}>
            {/* Preview Grid */}
            {hasImages && (
                <div className={cn(
                    'grid gap-3',
                    multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'
                )}>
                    {previews.map((preview, index) => (
                        <div
                            key={index}
                            className="relative aspect-square rounded-lg border overflow-hidden group"
                        >
                            <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemove(multiple ? preview : undefined)}
                                    disabled={disabled || uploadMutation.isPending}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {(!hasImages || (multiple && canAddMore)) && (
                <label
                    className={cn(
                        'flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors',
                        hasImages ? 'h-32' : 'h-48',
                        (disabled || uploadMutation.isPending) && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadMutation.isPending ? (
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        ) : (
                            <>
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    {hasImages
                                        ? `Add more images (${previews.length}/${maxFiles})`
                                        : 'Click to upload image'
                                    }
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    JPEG, PNG, or WEBP (Max 10MB{multiple ? ' each' : ''})
                                </p>
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        disabled={disabled || uploadMutation.isPending}
                        multiple={multiple}
                    />
                </label>
            )}

            {/* Counter for multiple upload */}
            {multiple && hasImages && (
                <p className="text-xs text-muted-foreground text-center">
                    {previews.length} of {maxFiles} images uploaded
                </p>
            )}
        </div>
    );
}