import type { Languages } from '@/types';
import apiClient from './client';
import type { CreateNewsDto, News, NewsFormatted, UpdateNewsDto } from '@/types/entities';

export const newsApi = {
    getAll: async (lang: Languages = 'en'): Promise<NewsFormatted[]> => {
        const response = await apiClient.get<NewsFormatted[]>('/news', {
            headers: { 'Accept-Language': lang },
        });
        return response.data;
    },

    getOne: async (id: string, lang: Languages = 'en'): Promise<NewsFormatted> => {
        const response = await apiClient.get<NewsFormatted>(`/news/${id}`, {
            headers: { 'Accept-Language': lang },
        });
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