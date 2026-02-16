import apiClient from './client';
import type { PaginatedResult } from '@/types/pagination';
import type { CreateProductDto, FilterProductDto, Product, UpdateProductDto } from '@/types/products';

export const productsApi = {
    getAll: async (filters?: FilterProductDto): Promise<PaginatedResult<Product>> => {
        const params = new URLSearchParams();

        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.categoryId) params.append('categoryId', filters.categoryId);
        if (filters?.name) params.append('name', filters.name);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await apiClient.get<PaginatedResult<Product>>(
            `/products?${params.toString()}`
        );
        return response.data;
    },

    getOne: async (id: string): Promise<Product> => {
        const response = await apiClient.get<Product>(`/products/${id}`);
        return response.data;
    },

    getByCategory: async (categoryId: string): Promise<Product[]> => {
        const response = await apiClient.get<Product[]>(`/products/category/${categoryId}`);
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