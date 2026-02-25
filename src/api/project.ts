import apiClient from './client';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/types/project';
import type { PaginatedResult } from '@/types/pagination';

export interface ProjectFilterDto {
    page?: number;
    limit?: number;
    search?: string;
}

export const projectsApi = {
    getAll: async (filters?: ProjectFilterDto): Promise<PaginatedResult<Project>> => {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.search) params.append('search', filters.search);

        const response = await apiClient.get<PaginatedResult<Project>>(
            `/projects?${params.toString()}`
        );
        return response.data;
    },

    getOne: async (id: string): Promise<Project> => {
        const response = await apiClient.get<Project>(`/projects/${id}`);
        return response.data;
    },

    create: async (dto: CreateProjectDto): Promise<Project> => {
        const response = await apiClient.post<Project>('/projects', dto);
        return response.data;
    },

    update: async (id: string, dto: UpdateProjectDto): Promise<Project> => {
        const response = await apiClient.patch<Project>(`/projects/${id}`, dto);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/projects/${id}`);
    },
};