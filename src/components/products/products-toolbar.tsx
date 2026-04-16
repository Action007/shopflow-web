"use client";

import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { ProductSearch } from "@/components/products/product-search";
import {
    ProductFilters,
    getProductFilterState,
} from "@/components/products/product-filters";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import type { Category } from "@/types/product";

interface ProductsToolbarProps {
    total?: number;
    categories: Category[];
    currentCategory?: string;
    currentSort?: string;
    currentOrder?: string;
    currentSearch?: string;
    minPrice?: string;
    maxPrice?: string;
}

export function ProductsToolbar({
    total,
    categories,
    currentCategory,
    currentSort,
    currentOrder,
    currentSearch,
    minPrice,
    maxPrice,
}: ProductsToolbarProps) {
    const router = useRouter();
    const { hasActiveFilters } = getProductFilterState({
        currentCategory,
        currentSort,
        currentOrder,
        minPrice,
        maxPrice,
    });

    const clearFilters = () => {
        const params = new URLSearchParams();

        if (currentSearch?.trim()) {
            params.set("search", currentSearch.trim());
        }

        router.push(
            params.toString()
                ? `${ROUTES.PRODUCTS}?${params.toString()}`
                : ROUTES.PRODUCTS,
        );
    };

    return (
        <section className="mb-6 lg:flex lg:justify-between">
            <div className="mb-4 flex items-end justify-between gap-4 lg:mb-0">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-on-surface">
                        All Products
                    </h1>
                    {typeof total === "number" ? (
                        <p className="mt-2 text-sm text-outline">
                            Showing {total} items
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="space-y-3 lg:w-full lg:max-w-md">
                <ProductSearch className="w-full" />
                <div className="flex flex-wrap justify-end gap-2 lg:hidden">
                    <ProductFilters
                        categories={categories}
                        currentCategory={currentCategory}
                        currentSort={currentSort}
                        currentOrder={currentOrder}
                        currentSearch={currentSearch}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        desktopLayout="hidden"
                        mobileTriggerVariant="toolbar"
                    />
                    {hasActiveFilters ? (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={clearFilters}
                            className="h-9 rounded-full px-4 text-xs font-bold uppercase tracking-widest"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset
                        </Button>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
