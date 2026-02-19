import apiClient from "./client";

export interface UploadResponse {
    urls: string[];
}

export const uploadApi = {
    uploadImages: async (files: File[]): Promise<string[]> => {
        const formData = new FormData();

        files?.forEach((file) => {
            formData.append("files", file);
        });

        const response = await apiClient.post<UploadResponse>(`/upload/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data?.urls;
    },

    deleteFile: async (fileUrl: string): Promise<void> => {
        await apiClient.delete(`/upload`, {
            data: { fileUrl },
        })
    }
}