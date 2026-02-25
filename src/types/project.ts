import type { Portfolio } from "./portfolio";

export interface Project {
    id: string;
    nameUz: string;
    nameRu: string;
    nameEn: string;
    createdAt: string;
    updatedAt: string;
    portfolios?: Portfolio[];
}

export interface CreateProjectDto {
    nameEn: string;
    nameRu: string;
    nameUz: string;
}

export type UpdateProjectDto = Partial<CreateProjectDto>;