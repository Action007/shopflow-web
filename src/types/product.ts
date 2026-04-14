export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: string; // decimal comes as string from prisma
    stockQuantity: number;
    imageUrl: string | null;
    categoryId: string;
    category: Category;
    createdAt: string;
}

export interface CreateProductInput {
    name: string;
    description?: string;
    imageUploadId: string;
    price: string;
    stockQuantity: number;
    categoryId: string;
}

export interface UpdateProductInput {
    name?: string;
    description?: string;
    imageUploadId?: string;
    price?: string;
    stockQuantity?: number;
    categoryId?: string;
}

export interface Category {
    id: string;
    name: string;
    description: string | null;
    parentId: string | null;
    parent?: Category | null;
    children?: Category[];
}

export interface CreateCategoryInput {
    name: string;
    description?: string;
    parentId?: string | null;
}

export interface UpdateCategoryInput {
    name: string;
    description?: string;
    parentId?: string | null;
}

export interface PaginatedResult<T> {
    items: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

export interface ProductSearchParams {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
}
