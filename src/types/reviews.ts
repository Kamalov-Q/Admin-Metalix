import type { Product } from './products';

export type ReviewStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Review {
    id: string;
    fullName: string;
    rating: number;
    description: string;
    product: Product;
    productId: string;
    status: ReviewStatus;
    createdAt: string;
}

export interface UpdateReviewStatusDto {
    status: ReviewStatus;
}