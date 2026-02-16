
export interface Meta {
    length?: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface PaginationType {
    meta: Meta;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: Meta;
}
