import { Suspense } from "react";
import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import { buildQueryString } from "@/lib/utils";
import type {
    PaginatedResult,
    Product,
    Category,
    ProductSearchParams,
} from "@/types/product";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductSortSelect } from "@/components/products/product-sort-select";
import { Pagination } from "@/components/shared/pagination";
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";
import { API_ROUTES } from "@/lib/constants/routes";
import { ERRORS } from "@/lib/constants/errors";

export const metadata: Metadata = {
    title: "Products",
    description: "Browse our product catalog",
};

interface ProductsPageProps {
    searchParams: Promise<ProductSearchParams>;
}

export default async function ProductsPage({
    searchParams,
}: ProductsPageProps) {
    const params = await searchParams;
    const categories = await apiGet<Category[]>(API_ROUTES.CATEGORIES, {
        revalidate: 300,
    });

    return (
        <div className="px-6 pb-32 pt-8 lg:mx-auto lg:flex lg:max-w-[1280px] lg:gap-8 lg:px-12">
            <ProductFilters
                categories={categories}
                currentCategory={params.categoryId}
                currentSort={params.sortBy}
                currentOrder={params.sortOrder}
                minPrice={params.minPrice}
                maxPrice={params.maxPrice}
            />

            <div className="mx-auto w-full max-w-md lg:max-w-none lg:flex-1">
                <Suspense
                    key={JSON.stringify(params)}
                    fallback={
                        <div className="space-y-8">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <div className="mb-2 h-10 w-40 rounded-full shimmer" />
                                    <div className="h-4 w-28 rounded-full shimmer opacity-50" />
                                </div>
                                <div className="hidden h-12 w-44 rounded-lg shimmer lg:block" />
                            </div>
                            <ProductGridSkeleton />
                        </div>
                    }
                >
                    <ProductList params={params} />
                </Suspense>
            </div>
        </div>
    );
}

async function ProductList({ params }: { params: ProductSearchParams }) {
    const queryString = buildQueryString(params);

    const result = await apiGet<PaginatedResult<Product>>(
        `${API_ROUTES.PRODUCTS.LIST}${queryString}`,
        { revalidate: 300 },
    );

    const sortValue =
        params.sortBy === "price" && params.sortOrder === "asc"
            ? "price-asc"
            : params.sortBy === "price" && params.sortOrder === "desc"
              ? "price-desc"
              : params.sortBy === "name"
                ? "name-asc"
                : params.sortBy === "createdAt"
                  ? "newest"
                  : "featured";

    if (result.items.length === 0) {
        return (
            <div className="rounded-3xl border border-outline-variant/10 bg-surface-low px-6 py-12 text-center">
                <h2 className="text-xl font-bold tracking-tight text-on-surface">
                    No products found
                </h2>
                <p className="mt-2 text-sm text-neutral-400">
                    {ERRORS.PAGES.NO_PRODUCTS}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-on-surface">
                        All Products
                    </h1>
                    <p className="mt-2 text-sm text-outline">
                        Showing {result.meta.total} items
                    </p>
                </div>

                <div className="hidden lg:block">
                    <ProductSortSelect
                        value={sortValue}
                        className="w-48 bg-surface-high"
                    />
                </div>
            </div>

            <ProductGrid
                products={result.items}
                className="grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            />

            <div className="mt-16">
                <Pagination meta={result.meta} />
            </div>
        </>
    );
}
