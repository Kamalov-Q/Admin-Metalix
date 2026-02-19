import { uploadApi } from "@/api/upload";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";



export function useUploadImage() {
    return useMutation({
        mutationFn: (files: File[]) => uploadApi.uploadImages(files),
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to upload image!';
            toast.error(message);
        },
    });
}


export function useDeleteFile() {
    return useMutation({
        mutationFn: uploadApi.deleteFile,
        onSuccess: () => {
            toast.success('File deleted successfully!');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to delete file!';
            toast.error(message);
        }
    })
}