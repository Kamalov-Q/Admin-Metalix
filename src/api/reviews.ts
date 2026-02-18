import type { Review, UpdateReviewStatusDto } from '@/types/reviews';
import apiClient from './client';
import type { PaginatedResult } from '@/types/pagination';

export interface ReviewFilterDto {
    page?: number;
    limit?: number;
    fullName?: string;
    productId?: string;
    status?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export const reviewsApi = {
    getAll: async (filters?: ReviewFilterDto): Promise<PaginatedResult<Review>> => {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.fullName) params.append('fullName', filters.fullName);
        if (filters?.productId) params.append('productId', filters.productId);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await apiClient.get<PaginatedResult<Review>>(
            `/reviews?${params.toString()}`
        );
        return response.data;
    },

    getOne: async (id: string): Promise<Review> => {
        const response = await apiClient.get<Review>(`/reviews/${id}`);
        return response.data;
    },

    updateStatus: async (id: string, dto: UpdateReviewStatusDto): Promise<Review> => {
        const response = await apiClient.patch<Review>(`/reviews/${id}`, dto);
        return response.data;
    },
};