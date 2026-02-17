import type { UpdateRequestStatusDto, Request } from '@/types/requests';
import apiClient from './client';
import type { PaginatedResult } from '@/types/pagination';

export interface RequestFilterDto {
    page?: number;
    limit?: number;
    fullName?: string;
    productId?: string;
    status?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export const requestsApi = {
    getAll: async (filters?: RequestFilterDto): Promise<PaginatedResult<Request>> => {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.fullName) params.append('fullName', filters.fullName);
        if (filters?.productId) params.append('productId', filters.productId);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await apiClient.get<PaginatedResult<Request>>(
            `/requests?${params.toString()}`
        );
        return response.data;
    },

    getOne: async (id: string): Promise<Request> => {
        const response = await apiClient.get<Request>(`/requests/${id}`);
        return response.data;
    },

    updateStatus: async (id: string, dto: UpdateRequestStatusDto): Promise<Request> => {
        const response = await apiClient.patch<Request>(`/requests/${id}/status`, dto);
        return response.data;
    },
};