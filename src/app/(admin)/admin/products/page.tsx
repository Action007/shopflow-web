import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import { buildQueryString } from "@/lib/utils";
import { API_ROUTES, ROUTES } from "@/lib/constants/routes";
import { AdminProductManager } from "@/components/admin/admin-product-manager";
import { Pagination } from "@/components/shared/pagination";
import type { Category, PaginatedResult, Product } from "@/types/product";
import type { ProductSearchParams } from "@/types/product";

export const metadata: Metadata = {
    title: "Admin Products",
};

interface AdminProductsPageProps {
    searchParams: Promise<ProductSearchParams>;
}

export default async function AdminProductsPage({
    searchParams,
}: AdminProductsPageProps) {
    const params = await searchParams;
    const effectiveParams = {
        ...params,
        limit: params.limit ?? "12",
    };
    const queryString = buildQueryString(effectiveParams);
    const [products, categories] = await Promise.all([
        apiGet<PaginatedResult<Product>>(
            `${API_ROUTES.PRODUCTS.LIST}${queryString}`,
            { revalidate: 300, tags: ["products"] },
        ),
        apiGet<Category[]>(API_ROUTES.CATEGORIES, { revalidate: 300 }),
    ]);

    const sortValue =
        params.sortBy === "price" && params.sortOrder === "asc"
            ? "price-asc"
            : params.sortBy === "price" &&
                params.sortOrder === "desc"
              ? "price-desc"
              : params.sortBy === "name"
                ? "name-asc"
                : params.sortBy === "createdAt"
                  ? "newest"
                  : "featured";

    return (
        <div className="space-y-6">
            <AdminProductManager
                products={products.items}
                categories={categories}
                totalProducts={products.meta.total}
                sortValue={sortValue}
                currentCategory={params.categoryId}
            />

            <Pagination
                meta={products.meta}
                basePath={ROUTES.ADMIN.PRODUCTS}
            />
        </div>
    );
}
