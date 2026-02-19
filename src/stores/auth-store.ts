import type { User } from '@/types/auth';
import { create } from 'zustand';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
    clearAuth: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,

    setUser: (user) => set({ user, isAuthenticated: true }),

    setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ accessToken, refreshToken, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        });
    },

    clearAuth: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        });
    },

    initialize: () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userRaw = localStorage.getItem('user');

        if (accessToken && userRaw) {
            try {
                const user = JSON.parse(userRaw);
                set({ user, accessToken, refreshToken, isAuthenticated: true });
            } catch {
                localStorage.removeItem('user');
            }
        }
    },
}));