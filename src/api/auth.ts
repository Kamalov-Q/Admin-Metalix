import type { AuthResponse, LoginDto } from '@/types/auth';
import apiClient from './client';
import { useAuthStore } from '@/stores/auth-store';

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
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
            await apiClient.post('/auth/logout', { refreshToken }).catch(() => { });
        }
        useAuthStore.getState().logout();
    },
};