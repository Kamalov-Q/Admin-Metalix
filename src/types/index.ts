// Enums
export type Role = 'ADMIN' | 'USER';

export type Languages = 'en' | 'ru' | 'uz';

export type RequestStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// User Types
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

// Category Types
export interface Category {
    id: string;
    nameEn: string;
    nameRu: string;
    nameUz: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryDto {
    nameEn: string;
    nameRu: string;
    nameUz: string;
}

export interface UpdateCategoryDto {
    nameEn?: string;
    nameRu?: string;
    nameUz?: string;
}

export interface CategoryFormatted {
    id: string;
    name: string;
}