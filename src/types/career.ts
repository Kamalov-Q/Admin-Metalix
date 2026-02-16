export interface Career {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    position: string;
    resumeUrl: string;
    coverLetter?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCareerDto {
    fullName: string;
    email: string;
    phoneNumber: string;
    position: string;
    resumeUrl: string;
    coverLetter?: string;
}