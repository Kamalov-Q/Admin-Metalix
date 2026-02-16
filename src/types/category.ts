
export interface Category {
    id: string;
    nameUz: string;
    nameRu: string;
    nameEn: string;
    createdAt?: string;
    updatedAt?: string;
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
