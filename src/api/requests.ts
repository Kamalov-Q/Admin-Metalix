import apiClient from './client';
import type { Request, UpdateRequestStatusDto } from '@/types/requests';

export const requestsApi = {
    getAll: async (): Promise<Request[]> => {
        const response = await apiClient.get<Request[]>('/requests');
        return response.data;
    },

    getOne: async (id: string): Promise<Request> => {
        const response = await apiClient.get<Request>(`/requests/${id}`);
        return response.data;
    },

    getByProduct: async (productId: string): Promise<Request[]> => {
        const response = await apiClient.get<Request[]>(`/requests/product/${productId}`);
        return response.data;
    },

    updateStatus: async (id: string, dto: UpdateRequestStatusDto): Promise<Request> => {
        const response = await apiClient.patch<Request>(`/requests/${id}`, dto);
        return response.data;
    },
};