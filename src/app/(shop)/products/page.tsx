import { Suspense } from "react";
import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import { buildQueryString } from "@/lib/utils";
import type {
    PaginatedResult,
    Product,
    ProductSearchParams,
} from "@/types/product";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { Pagination } from "@/components/shared/pagination";
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";

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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Products</h1>
                <p className="mt-2 text-muted-foreground">
                    Browse our collection
                </p>
            </div>

            <ProductFilters
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
        `/products${queryString}`,
        { revalidate: 300 },
    );

    if (result.items.length === 0) {
        return (
            <div className="py-12 text-center text-muted-foreground">
                No products found. Try adjusting your filters.
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
