// Enums
export type Role = 'ADMIN' | 'USER';

export type Languages = 'en' | 'ru' | 'uz';

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface LoginDto {
    email: string;
    password: string;
}
