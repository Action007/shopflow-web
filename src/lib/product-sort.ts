import type { ProductSearchParams } from "@/types/product";

export type ProductSortValue =
    | "featured"
    | "newest"
    | "price-asc"
    | "price-desc"
    | "name-asc";

export const DEFAULT_PRODUCT_SORT: ProductSortValue = "featured";

const PRODUCT_SORT_VALUES: ProductSortValue[] = [
    "featured",
    "newest",
    "price-asc",
    "price-desc",
    "name-asc",
];

export function isProductSortValue(value: string): value is ProductSortValue {
    return PRODUCT_SORT_VALUES.includes(value as ProductSortValue);
}

export function getProductSortValue(
    sortBy?: ProductSearchParams["sortBy"],
    sortOrder?: ProductSearchParams["sortOrder"],
): ProductSortValue {
    if (sortBy === "price" && sortOrder === "asc") {
        return "price-asc";
    }

    if (sortBy === "price" && sortOrder === "desc") {
        return "price-desc";
    }

    if (sortBy === "name") {
        return "name-asc";
    }

    if (sortBy === "createdAt") {
        return "newest";
    }

    return DEFAULT_PRODUCT_SORT;
}

export function applyProductSortValue(
    params: URLSearchParams,
    sortValue: ProductSortValue,
) {
    if (sortValue === DEFAULT_PRODUCT_SORT) {
        params.delete("sortBy");
        params.delete("sortOrder");
        return;
    }

    if (sortValue === "price-asc") {
        params.set("sortBy", "price");
        params.set("sortOrder", "asc");
        return;
    }

    if (sortValue === "price-desc") {
        params.set("sortBy", "price");
        params.set("sortOrder", "desc");
        return;
    }

    if (sortValue === "name-asc") {
        params.set("sortBy", "name");
        params.set("sortOrder", "asc");
        return;
    }

    params.set("sortBy", "createdAt");
    params.set("sortOrder", "desc");
}
