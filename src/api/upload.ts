import apiClient from './client';

export interface UploadResponse {
    url: string;
}

export const uploadApi = {
    uploadImage: async (file: File, folder: string = 'uploads'): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await apiClient.post<UploadResponse>('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.url;
    },

    uploadResume: async (file: File, folder: string = 'resumes'): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await apiClient.post<UploadResponse>('/upload/resume', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.url;
    },

    deleteFile: async (fileUrl: string): Promise<void> => {
        await apiClient.delete('/upload', {
            data: { fileUrl },
        });
    },
};