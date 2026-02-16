import { type Category } from './index';

// Product Types
export interface Product {
    id: string;
    nameEn: string;
    nameRu: string;
    nameUz: string;
    descriptionEn: string;
    descriptionRu: string;
    descriptionUz: string;
    imageUrl: string;
    categoryId: string;
    category?: Category;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductDto {
    nameEn: string;
    nameRu: string;
    nameUz: string;
    descriptionEn: string;
    descriptionRu: string;
    descriptionUz: string;
    imageUrl: string;
    categoryId: string;
}

export interface UpdateProductDto {
    nameEn?: string;
    nameRu?: string;
    nameUz?: string;
    descriptionEn?: string;
    descriptionRu?: string;
    descriptionUz?: string;
    imageUrl?: string;
    categoryId?: string;
}

export interface ProductFormatted {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    category: {
        id: string;
        name: string;
    };
}

// News Types
export interface News {
    id: string;
    titleEn: string;
    titleRu: string;
    titleUz: string;
    contentEn: string;
    contentRu: string;
    contentUz: string;
    imageUrl: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateNewsDto {
    titleEn: string;
    titleRu: string;
    titleUz: string;
    contentEn: string;
    contentRu: string;
    contentUz: string;
    imageUrl: string;
    author: string;
}

export interface UpdateNewsDto {
    titleEn?: string;
    titleRu?: string;
    titleUz?: string;
    contentEn?: string;
    contentRu?: string;
    contentUz?: string;
    imageUrl?: string;
    author?: string;
}

export interface NewsFormatted {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}