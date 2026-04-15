import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import { buildQueryString } from "@/lib/utils";
import { CACHE_CONFIG, CACHE_TAGS } from "@/lib/constants/cache";
import { API_ROUTES, ROUTES } from "@/lib/constants/routes";
import { AdminProductManager } from "@/components/admin/admin-product-manager";
import { Pagination } from "@/components/shared/pagination";
import { normalizePaginationParams } from "@/lib/pagination-params";
import { getProductSortValue } from "@/lib/product-sort";
import type { Category, PaginatedResult, Product } from "@/types/product";
import type { ProductSearchParams } from "@/types/product";
import { redirect } from "next/navigation";

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
    const paginationState = normalizePaginationParams(params);

    if (paginationState.needsRedirect) {
        redirect(`${ROUTES.ADMIN.PRODUCTS}${paginationState.queryString}`);
    }

    const effectiveParams = paginationState.effectiveParams;
    const queryString = buildQueryString(effectiveParams);
    const [products, categories] = await Promise.all([
        apiGet<PaginatedResult<Product>>(
            `${API_ROUTES.PRODUCTS.LIST}${queryString}`,
            {
                revalidate: CACHE_CONFIG.CATALOG_REVALIDATE_SECONDS,
                tags: [CACHE_TAGS.PRODUCTS],
            },
        ),
        apiGet<Category[]>(API_ROUTES.CATEGORIES.LIST, {
            revalidate: CACHE_CONFIG.CATALOG_REVALIDATE_SECONDS,
            tags: [CACHE_TAGS.CATEGORIES],
        }),
    ]);

    const sortValue = getProductSortValue(
        effectiveParams.sortBy,
        effectiveParams.sortOrder,
    );

    return (
        <div className="space-y-6">
            <AdminProductManager
                products={products.items}
                categories={categories}
                totalProducts={products.meta.total}
                sortValue={sortValue}
                currentCategory={effectiveParams.categoryId}
            />

            <Pagination
                meta={products.meta}
                basePath={ROUTES.ADMIN.PRODUCTS}
            />
        </div>
    );
}
