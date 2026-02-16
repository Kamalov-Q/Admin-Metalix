import type { RequestStatus, ReviewStatus } from './index';
import { type Product } from './entities';

// Request Types
export interface Request {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    companyName?: string;
    message?: string;
    productId: string;
    product?: Product;
    status: RequestStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRequestDto {
    fullName: string;
    email: string;
    phoneNumber: string;
    companyName?: string;
    message?: string;
    productId: string;
}

export interface UpdateRequestDto {
    status: RequestStatus;
}

// Review Types
export interface Review {
    id: string;
    fullName: string;
    email: string;
    rating: number;
    comment: string;
    productId: string;
    product?: Product;
    status: ReviewStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewDto {
    fullName: string;
    email: string;
    rating: number;
    comment: string;
    productId: string;
}

export interface UpdateReviewStatusDto {
    status: ReviewStatus;
}

// Career Types
export interface Career {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    position: string;
    resumeUrl: string;
    coverLetter?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCareerDto {
    fullName: string;
    email: string;
    phoneNumber: string;
    position: string;
    resumeUrl: string;
    coverLetter?: string;
}

// Pagination Types
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}

// Filter Types
export interface FilterDto {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface FilterProductDto extends FilterDto {
    categoryId?: string;
    name?: string;
}