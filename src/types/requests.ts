import { type Product } from './entities';

export type RequestStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

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


