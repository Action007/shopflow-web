import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ApiClientError, apiGet } from "@/lib/api";
import { buildQueryString } from "@/lib/utils";
import type {
    PaginatedResult,
    Product,
    Category,
    ProductSearchParams,
} from "@/types/product";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductsToolbar } from "@/components/products/products-toolbar";
import { Pagination } from "@/components/shared/pagination";
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";
import { Button } from "@/components/ui/button";
import { API_ROUTES, ROUTES } from "@/lib/constants/routes";
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
                    key={`toolbar-${JSON.stringify(params)}`}
                    fallback={<ProductsToolbar />}
                >
                    <ProductsToolbarData params={params} />
                </Suspense>

                <Suspense
                    key={`results-${JSON.stringify(params)}`}
                    fallback={<ProductGridSkeleton />}
                >
                    <ProductsResults params={params} />
                </Suspense>
            </div>
        </div>
    );
}

async function ProductsToolbarData({
    params,
}: {
    params: ProductSearchParams;
}) {
    const state = await getProductsState(params);

    return (
        <ProductsToolbar
            total={state.result?.meta.total}
        />
    );
}

async function ProductsResults({ params }: { params: ProductSearchParams }) {
    const state = await getProductsState(params);

    if (state.error) {
        return (
            <div className="rounded-3xl border border-error/10 bg-error-container/5 px-6 py-12 text-center">
                <h2 className="text-xl font-bold tracking-tight text-on-surface">
                    Invalid filters
                </h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                    {state.error.message}
                </p>
            </div>
        );
    }

    if (!state.result) {
        return null;
    }

    const { result } = state;

    if (result.items.length === 0) {
        return (
            <div className="rounded-3xl border border-outline-variant/10 bg-surface-low px-6 py-12 text-center">
                <h2 className="text-xl font-bold tracking-tight text-on-surface">
                    No products found
                </h2>
                <p className="mt-2 text-sm text-neutral-400">
                    {ERRORS.PAGES.NO_PRODUCTS}
                </p>
                <Button
                    asChild
                    variant="secondary"
                    className="mt-6 bg-surface-high text-on-surface hover:bg-surface-highest"
                >
                    <Link href={ROUTES.PRODUCTS}>Reset Filters</Link>
                </Button>
            </div>
        );
    }

    return (
        <>
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

async function getProductsState(params: ProductSearchParams) {
    try {
        const queryString = buildQueryString(params);

        const result = await apiGet<PaginatedResult<Product>>(
            `${API_ROUTES.PRODUCTS.LIST}${queryString}`,
            { revalidate: 300 },
        );

        return { result, error: null } as const;
    } catch (error) {
        if (error instanceof ApiClientError && error.statusCode === 400) {
            return { result: null, error } as const;
        }

        throw error;
    }
}
