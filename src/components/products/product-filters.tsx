"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { PriceRangeForm } from "@/components/products/price-range-form";
import { ProductSortSelect } from "@/components/products/product-sort-select";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";
import type { Category } from "@/types/product";

interface ProductFiltersProps {
    categories: Category[];
    currentCategory?: string;
    currentSort?: string;
    currentOrder?: string;
    minPrice?: string;
    maxPrice?: string;
    basePath?: string;
    desktopLayout?: "sidebar" | "inline";
}

export function ProductFilters({
    categories,
    currentCategory,
    currentSort,
    currentOrder,
    minPrice,
    maxPrice,
    basePath = ROUTES.PRODUCTS,
    desktopLayout = "sidebar",
}: ProductFiltersProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const updateCategory = (categoryId?: string) => {
        const params = new URLSearchParams();

        if (categoryId) {
            params.set("categoryId", categoryId);
        }

        setOpen(false);
        router.push(
            params.toString()
                ? `${basePath}?${params.toString()}`
                : basePath,
        );
    };

    const clearAllFilters = () => {
        router.push(basePath);
        setOpen(false);
    };

    const sortValue =
        currentSort === "price" && currentOrder === "asc"
            ? "price-asc"
            : currentSort === "price" && currentOrder === "desc"
              ? "price-desc"
              : currentSort === "name"
                ? "name-asc"
                : currentSort === "createdAt"
                  ? "newest"
                  : "featured";

    const filterPanel = (
        <div className="space-y-8">
            <section>
                <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-outline">
                    Categories
                </h4>
                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={() => updateCategory()}
                        className={cn(
                            "block py-1 text-left text-sm transition-colors duration-300 ease-fluid",
                            !currentCategory
                                ? "font-semibold text-primary"
                                : "text-on-surface/70 hover:text-on-surface",
                        )}
                    >
                        All Products
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => updateCategory(category.id)}
                            className={cn(
                                "block py-1 text-left text-sm transition-colors duration-300 ease-fluid",
                                currentCategory === category.id
                                    ? "font-semibold text-primary"
                                    : "text-on-surface/70 hover:text-on-surface",
                            )}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-outline">
                    Price Range
                </h4>
                <PriceRangeForm
                    key={`${minPrice ?? ""}-${maxPrice ?? ""}`}
                    initialMinPrice={minPrice}
                    initialMaxPrice={maxPrice}
                    basePath={basePath}
                    onApply={() => setOpen(false)}
                />
            </section>

            <section>
                <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-outline">
                    Sort By
                </h4>
                <ProductSortSelect
                    value={sortValue}
                    className="w-full"
                    basePath={basePath}
                    onChangeComplete={() => setOpen(false)}
                />
            </section>

            <Button
                type="button"
                variant="secondary"
                onClick={clearAllFilters}
                className="w-full justify-center bg-surface-high text-on-surface hover:bg-surface-highest"
            >
                Clear Filters
            </Button>
        </div>
    );

    return (
        <>
            {desktopLayout === "sidebar" ? (
                <aside className="hidden lg:block lg:w-60 lg:shrink-0 lg:self-start lg:rounded-xl lg:bg-surface-low lg:p-6 lg:sticky lg:top-24">
                    {filterPanel}
                </aside>
            ) : (
                <section className="hidden rounded-[28px] border border-outline-variant/15 bg-surface-low p-5 lg:block">
                    {filterPanel}
                </section>
            )}

            <div className="fixed bottom-16 left-1/2 z-40 -translate-x-1/2 lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="secondary"
                            className="rounded-full px-6 py-3"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="bottom"
                        className="max-h-[calc(100dvh-2rem)]"
                    >
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4 text-primary" />
                                Filters
                            </SheetTitle>
                        </SheetHeader>
                        <div className="overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                            {filterPanel}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
