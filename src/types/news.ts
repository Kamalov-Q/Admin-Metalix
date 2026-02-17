export interface News {
    id: string;
    imageUrl: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    contentUz: string;
    contentRu: string;
    contentEn: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateNewsDto {
    imageUrl: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    contentUz: string;
    contentRu: string;
    contentEn: string;
    author: string;
}

export type UpdateNewsDto = Partial<CreateNewsDto>;