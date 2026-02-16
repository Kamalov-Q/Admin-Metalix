import apiClient from "./client";

export interface UploadResponse {
    url: string;
}

export const uploadApi = {
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<UploadResponse>(`/upload/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.url;
    },

    deleteFile: async (fileUrl: string): Promise<void> => {
        await apiClient.delete(`/upload`, {
            data: { fileUrl },
        })
    }
}