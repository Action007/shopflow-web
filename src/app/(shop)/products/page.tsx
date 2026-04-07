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
import { ProductSearch } from "@/components/products/product-search";
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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Products</h1>
                <p className="mt-2 text-muted-foreground">
                    Browse our collection
                </p>
            </div>

            <div className="mb-6 max-w-md">
                <ProductSearch />
            </div>

            <ProductFilters
                categories={categories}
                currentCategory={params.categoryId}
                currentSort={params.sortBy}
                currentOrder={params.sortOrder}
            />

            <Suspense
                key={JSON.stringify(params)}
                fallback={<ProductGridSkeleton />}
            >
                <ProductList params={params} />
            </Suspense>
        </div>
    );
}

async function ProductList({ params }: { params: ProductSearchParams }) {
    const queryString = buildQueryString(params);

    const result = await apiGet<PaginatedResult<Product>>(
        `${API_ROUTES.PRODUCTS.LIST}${queryString}`,
        { revalidate: 300 },
    );

    if (result.items.length === 0) {
        return (
            <div className="py-12 text-center text-muted-foreground">
                {ERRORS.PAGES.NO_PRODUCTS}
            </div>
        );
    }

    return (
        <>
            <ProductGrid products={result.items} />
            <div className="mt-8">
                <Pagination meta={result.meta} />
            </div>
        </>
    );
}
