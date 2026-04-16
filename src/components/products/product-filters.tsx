"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Filter, SlidersHorizontal } from "lucide-react";
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
import { DEFAULT_PRODUCT_SORT, getProductSortValue } from "@/lib/product-sort";
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

function categoryContainsId(category: Category, targetId?: string): boolean {
    if (!targetId) return false;
    if (category.id === targetId) return true;

    return (category.children ?? []).some((child) =>
        categoryContainsId(child, targetId),
    );
}

function CategoryAccordionItem({
    category,
    currentCategory,
    depth = 0,
    path,
    onSelect,
}: {
    category: Category;
    currentCategory?: string;
    depth?: number;
    path: string;
    onSelect: (categoryId?: string) => void;
}) {
    const hasChildren = (category.children?.length ?? 0) > 0;
    const isActive = currentCategory === category.id;
    const isInActiveBranch = categoryContainsId(category, currentCategory);
    const [isExpanded, setIsExpanded] = useState(isInActiveBranch);

    return (
        <div className="space-y-1">
            <div
                className="flex items-center gap-1"
                style={{ paddingLeft: `${depth * 14}px` }}
            >
                {hasChildren ? (
                    <button
                        type="button"
                        onClick={() => setIsExpanded((open) => !open)}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-on-surface/50 transition-colors duration-300 ease-fluid hover:bg-surface-high hover:text-on-surface"
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${category.name}`}
                        aria-expanded={isExpanded}
                    >
                        <ChevronRight
                            className={cn(
                                "h-3.5 w-3.5 transition-transform duration-300 ease-fluid",
                                isExpanded && "rotate-90",
                            )}
                        />
                    </button>
                ) : (
                    <span
                        aria-hidden="true"
                        className="inline-flex h-5 w-5 items-center justify-center"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-outline-variant/50" />
                    </span>
                )}

                <button
                    type="button"
                    onClick={() => onSelect(category.id)}
                    className={cn(
                        "min-h-8 flex-1 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-300 ease-fluid",
                        isActive
                            ? "bg-primary/10 font-semibold text-primary"
                            : "text-on-surface/70 hover:bg-surface-high hover:text-on-surface",
                    )}
                    title={path}
                >
                    {category.name}
                </button>
            </div>

            {hasChildren && isExpanded ? (
                <div className="space-y-1">
                    {category.children?.map((child) => (
                        <CategoryAccordionItem
                            key={child.id}
                            category={child}
                            currentCategory={currentCategory}
                            depth={depth + 1}
                            path={`${path} / ${child.name}`}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
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
            params.toString() ? `${basePath}?${params.toString()}` : basePath,
        );
    };

    const clearAllFilters = () => {
        router.push(basePath);
        setOpen(false);
    };

    const sortValue = getProductSortValue(currentSort, currentOrder);
    const hasPriceFilter = Boolean(minPrice || maxPrice);
    const hasSortFilter = sortValue !== DEFAULT_PRODUCT_SORT;
    const hasActiveFilters = Boolean(
        currentCategory || hasPriceFilter || hasSortFilter,
    );
    const activeFilterCount =
        (currentCategory ? 1 : 0) +
        (hasPriceFilter ? 1 : 0) +
        (hasSortFilter ? 1 : 0);

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
                        <CategoryAccordionItem
                            key={category.id}
                            category={category}
                            currentCategory={currentCategory}
                            path={category.name}
                            onSelect={updateCategory}
                        />
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
                Reset Filters
            </Button>
        </div>
    );

    return (
        <>
            {desktopLayout === "sidebar" ? (
                <aside className="hidden lg:block lg:w-60 lg:shrink-0 lg:self-start lg:rounded-xl lg:bg-surface-low lg:p-6">
                    {filterPanel}
                </aside>
            ) : (
                <section className="hidden rounded-[28px] border border-outline-variant/15 bg-surface-low p-5 lg:block">
                    {filterPanel}
                </section>
            )}

            <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant={hasActiveFilters ? "secondary" : "default"}
                            className={cn(
                                "rounded-full px-6 py-3",
                                hasActiveFilters &&
                                    "border border-primary/20 bg-primary/10 text-primary hover:bg-primary/15",
                            )}
                        >
                            <Filter className="h-4 w-4" />
                            {hasActiveFilters
                                ? `Filters (${activeFilterCount})`
                                : "Filters"}
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
