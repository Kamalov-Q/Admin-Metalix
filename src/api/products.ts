import type { Languages } from '@/types';
import apiClient from './client';

import type { PaginatedResult, FilterProductDto } from '@/types/requests';
import type { CreateProductDto, Product, ProductFormatted, UpdateProductDto } from '@/types/entities';

export const productsApi = {
    getAll: async (lang: Languages = 'en', filters?: FilterProductDto): Promise<PaginatedResult<ProductFormatted>> => {
        const params = new URLSearchParams();

        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.categoryId) params.append('categoryId', filters.categoryId);
        if (filters?.name) params.append('name', filters.name);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await apiClient.get<PaginatedResult<ProductFormatted>>(
            `/products?${params.toString()}`,
            {
                headers: { 'Accept-Language': lang },
            }
        );
        return response.data;
    },

    getOne: async (id: string, lang: Languages = 'en'): Promise<ProductFormatted> => {
        const response = await apiClient.get<ProductFormatted>(`/products/${id}`, {
            headers: { 'Accept-Language': lang },
        });
        return response.data;
    },

    create: async (dto: CreateProductDto): Promise<Product> => {
        const response = await apiClient.post<Product>('/products', dto);
        return response.data;
    },

    update: async (id: string, dto: UpdateProductDto): Promise<Product> => {
        const response = await apiClient.patch<Product>(`/products/${id}`, dto);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/products/${id}`);
    },
};