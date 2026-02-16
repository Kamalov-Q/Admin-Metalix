import apiClient from './client';
import type { Review, UpdateReviewStatusDto } from '@/types/requests';

export const reviewsApi = {
    getAll: async (): Promise<Review[]> => {
        const response = await apiClient.get<Review[]>('/reviews');
        return response.data;
    },

    getOne: async (id: string): Promise<Review> => {
        const response = await apiClient.get<Review>(`/reviews/${id}`);
        return response.data;
    },

    getByProduct: async (productId: string): Promise<Review[]> => {
        const response = await apiClient.get<Review[]>(`/reviews/product/${productId}`);
        return response.data;
    },

    updateStatus: async (id: string, dto: UpdateReviewStatusDto): Promise<Review> => {
        const response = await apiClient.patch<Review>(`/reviews/${id}/status`, dto);
        return response.data;
    },
};