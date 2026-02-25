import type { Project } from "./project";


export interface Portfolio {
    id: string;
    imageUrls: string[];
    nameUz: string;
    nameRu: string;
    nameEn: string;
    descriptionUz: string;
    descriptionRu: string;
    descriptionEn: string;
    project: Project;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePortfolioDto {
    nameEn: string;
    nameRu: string;
    nameUz: string;
    descriptionEn: string;
    descriptionRu: string;
    descriptionUz: string;
    imageUrls: string[];
    projectId: string;
}

export type UpdatePortfolioDto = Partial<CreatePortfolioDto>;