import apiClient from './client';
import type { News, CreateNewsDto, UpdateNewsDto } from '@/types/news';
import type { PaginatedResult } from '@/types/pagination';

export interface NewsFilterDto {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export const newsApi = {
    getAll: async (filters?: NewsFilterDto): Promise<PaginatedResult<News>> => {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await apiClient.get<PaginatedResult<News>>(
            `/news?${params.toString()}`
        );
        return response.data;
    },

    getOne: async (id: string): Promise<News> => {
        const response = await apiClient.get<News>(`/news/${id}`);
        return response.data;
    },

    create: async (dto: CreateNewsDto): Promise<News> => {
        const response = await apiClient.post<News>('/news', dto);
        return response.data;
    },

    update: async (id: string, dto: UpdateNewsDto): Promise<News> => {
        const response = await apiClient.patch<News>(`/news/${id}`, dto);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/news/${id}`);
    },
};