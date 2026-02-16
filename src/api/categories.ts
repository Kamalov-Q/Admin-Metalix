import apiClient from './client';
import type {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
    CategoryFormatted,
    Languages
} from '@/types';
import type { PaginatedResult, FilterDto } from '@/types/requests';

export const categoriesApi = {
    getAll: async (lang: Languages = 'en', filters?: FilterDto): Promise<PaginatedResult<CategoryFormatted>> => {
        const params = new URLSearchParams();

        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await apiClient.get<PaginatedResult<CategoryFormatted>>(
            `/category?${params.toString()}`,
            {
                headers: { 'Accept-Language': lang },
            }
        );
        return response.data;
    },

    getOne: async (id: string, lang: Languages = 'en'): Promise<CategoryFormatted> => {
        const response = await apiClient.get<CategoryFormatted>(`/category/${id}`, {
            headers: { 'Accept-Language': lang },
        });
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
        await apiClient.delete(`/categories/${id}`);
    },
};