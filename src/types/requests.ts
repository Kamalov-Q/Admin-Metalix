import type { Product } from './products';

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Request {
    id: string;
    fullName: string;
    phoneNumber: string;
    product: Product;
    productId: string;
    status: RequestStatus;
    createdAt: string;
}

export interface UpdateRequestStatusDto {
    status: RequestStatus;
}