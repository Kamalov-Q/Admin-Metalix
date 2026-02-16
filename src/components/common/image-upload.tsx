import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUploadImage } from '@/hooks/use-upload';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    className?: string;
    disabled?: boolean;
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    className,
    disabled,
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | undefined>(value);
    const uploadMutation = useUploadImage();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Only JPEG, PNG, and WEBP images are allowed');
            return;
        }

        // Validate file size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('Image size must be less than 10MB');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to S3
        uploadMutation.mutate(file, {
            onSuccess: (url) => {
                onChange(url);
                setPreview(url);
            },
            onError: () => {
                setPreview(undefined);
            },
        });
    };

    const handleRemove = () => {
        setPreview(undefined);
        onChange('');
        if (onRemove) {
            onRemove();
        }
    };

    return (
        <div className={cn('space-y-2', className)}>
            {preview ? (
                <div className="relative w-full h-48 rounded-lg border overflow-hidden group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemove}
                            disabled={disabled || uploadMutation.isPending}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                        </Button>
                    </div>
                </div>
            ) : (
                <label
                    className={cn(
                        'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors',
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
                                    Click to upload image
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    JPEG, PNG, or WEBP (Max 10MB)
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
                    />
                </label>
            )}
        </div>
    );
}