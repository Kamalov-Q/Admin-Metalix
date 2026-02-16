import apiClient from './client';
import type { Career } from '@/types/requests';

export const careersApi = {
    getAll: async (): Promise<Career[]> => {
        const response = await apiClient.get<Career[]>('/careers');
        return response.data;
    },

    getOne: async (id: string): Promise<Career> => {
        const response = await apiClient.get<Career>(`/careers/${id}`);
        return response.data;
    },
};