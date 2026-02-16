import type { Category } from "./category";
import type { Review } from "./reviews";

export interface Product {
    id: string;
    nameEn: string;
    nameRu: string;
    nameUz: string;
    imageUrl: string;
    descriptionUz: string;
    descriptionRu: string;
    descriptionEn: string;
    category: Category;
    categoryId: string;
    createdAt: Date;
    reviews: Review[];
    requests: Request[];
}

export interface CreateProductDto {
    nameEn: string;
    nameRu: string;
    nameUz: string;
    imageUrl: string;
    descriptionUz: string;
    descriptionRu: string;
    descriptionEn: string;
    categoryId: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> { }

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