import type { Product } from "./products";

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

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