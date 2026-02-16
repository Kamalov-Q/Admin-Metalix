import type { PaginatedResult } from '@/types/pagination';
import apiClient from './client';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/category';
import type { FilterDto } from '@/types/products';

export const categoriesApi = {
    getAll: async (filters?: FilterDto): Promise<PaginatedResult<Category>> => {
        const params = new URLSearchParams();

        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await apiClient.get<PaginatedResult<Category>>(
            `/category?${params.toString()}`,
        );
        return response.data;
    },

    getOne: async (id: string): Promise<Category> => {
        const response = await apiClient.get<Category>(`/category/${id}`);
        return response.data;
    },

    create: async (dto: CreateCategoryDto): Promise<Category> => {
        const response = await apiClient.post<Category>('/category', dto);
        return response.data;
    },

    update: async (id: string, dto: UpdateCategoryDto): Promise<Category> => {
        const response = await apiClient.patch<Category>(`/category/${id}`, dto);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/category/${id}`);
    },
};