import apiClient from './client';
import type { Portfolio, CreatePortfolioDto, UpdatePortfolioDto } from '@/types/portfolio';
import type { PaginatedResult } from '@/types/pagination';

export interface PortfolioFilterDto {
    page?: number;
    limit?: number;
    search?: string;
    projectId?: string;
    name?: string;
}

export const portfoliosApi = {
    getAll: async (filters?: PortfolioFilterDto): Promise<PaginatedResult<Portfolio>> => {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.projectId) params.append('projectId', filters.projectId);
        if (filters?.name) params.append('name', filters.name);

        const response = await apiClient.get<PaginatedResult<Portfolio>>(
            `/portfolios?${params.toString()}`
        );
        return response.data;
    },

    getByProject: async (
        projectId: string,
        filters?: PortfolioFilterDto
    ): Promise<PaginatedResult<Portfolio>> => {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await apiClient.get<PaginatedResult<Portfolio>>(
            `/portfolios/project/${projectId}?${params.toString()}`
        );
        return response.data;
    },

    getOne: async (id: string): Promise<Portfolio> => {
        const response = await apiClient.get<Portfolio>(`/portfolios/${id}`);
        return response.data;
    },

    create: async (dto: CreatePortfolioDto): Promise<Portfolio> => {
        const response = await apiClient.post<Portfolio>('/portfolios', dto);
        return response.data;
    },

    update: async (id: string, dto: UpdatePortfolioDto): Promise<Portfolio> => {
        const response = await apiClient.patch<Portfolio>(`/portfolios/${id}`, dto);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/portfolios/${id}`);
    },
};