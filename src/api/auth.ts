import type { AuthResponse, LoginDto } from '@/types/auth';
import apiClient from './client';

export const authApi = {
    login: async (dto: LoginDto): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', dto);
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
        const response = await apiClient.post('/auth/refresh', { refreshToken });
        return response.data;
    },

    logout: async (): Promise<void> => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },
};