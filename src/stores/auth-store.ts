import type { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setUser: (user) => set({ user, isAuthenticated: true }),

            setTokens: (accessToken, refreshToken) =>
                set({ accessToken, refreshToken, isAuthenticated: true }),

            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
                localStorage.removeItem('auth-storage');
            },

            initialize: () => {
                const stored = localStorage.getItem('auth-storage');
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (parsed.state?.accessToken && parsed.state?.user) {
                            set({
                                user: parsed.state.user,
                                accessToken: parsed.state.accessToken,
                                refreshToken: parsed.state.refreshToken,
                                isAuthenticated: true,
                            });
                        }
                    } catch (error) {
                        console.error('Failed to parse stored auth:', error);
                    }
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        }
    )
);