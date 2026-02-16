import type { Career } from '@/types/career';
import apiClient from './client';

export const careersApi = {
    getAll: async (): Promise<Career[]> => {
        const response = await apiClient.get<Career[]>('/career');
        return response.data;
    },

    getOne: async (id: string): Promise<Career> => {
        const response = await apiClient.get<Career>(`/career/${id}`);
        return response.data;
    },
};