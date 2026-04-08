"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
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
}

export function ProductFilters({
    categories,
    currentCategory,
    currentSort,
    currentOrder,
    minPrice,
    maxPrice,
}: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.push(`/products?${params.toString()}`);
    };

    const updatePrice = (key: "minPrice" | "maxPrice", value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.push(`/products?${params.toString()}`);
    };

    const updateSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === "featured") {
            params.delete("sortBy");
            params.delete("sortOrder");
        } else if (value === "price-asc") {
            params.set("sortBy", "price");
            params.set("sortOrder", "asc");
        } else if (value === "price-desc") {
            params.set("sortBy", "price");
            params.set("sortOrder", "desc");
        } else if (value === "name-asc") {
            params.set("sortBy", "name");
            params.set("sortOrder", "asc");
        } else {
            params.set("sortBy", "createdAt");
            params.set("sortOrder", "desc");
        }

        params.delete("page");
        router.push(`/products?${params.toString()}`);
    };

    const clearAllFilters = () => {
        router.push(ROUTES.PRODUCTS);
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
                        onClick={() => updateParam("categoryId", "all")}
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
                            onClick={() => updateParam("categoryId", category.id)}
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
                <div className="flex items-center gap-2">
                    <Input
                        defaultValue={minPrice ?? ""}
                        placeholder="Min"
                        type="number"
                        className="bg-surface-low"
                        onBlur={(event) =>
                            updatePrice("minPrice", event.currentTarget.value)
                        }
                    />
                    <Input
                        defaultValue={maxPrice ?? ""}
                        placeholder="Max"
                        type="number"
                        className="bg-surface-low"
                        onBlur={(event) =>
                            updatePrice("maxPrice", event.currentTarget.value)
                        }
                    />
                </div>
            </section>

            <section>
                <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-outline">
                    Sort By
                </h4>
                <Select value={sortValue} onValueChange={updateSort}>
                    <SelectTrigger className="w-full bg-surface-low">
                        <SelectValue placeholder="Featured" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="newest">Newest Arrivals</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="name-asc">Name</SelectItem>
                    </SelectContent>
                </Select>
            </section>

            <Button
                type="button"
                variant="ghost"
                onClick={clearAllFilters}
                className="w-full justify-center border border-outline-variant/20"
            >
                Clear Filters
            </Button>
        </div>
    );

    return (
        <>
            <aside className="hidden lg:block lg:w-60 lg:shrink-0 lg:self-start lg:rounded-xl lg:bg-surface-low lg:p-6 lg:sticky lg:top-24">
                {filterPanel}
            </aside>

            <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button className="rounded-full px-6 py-3 text-on-primary">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="max-h-[80vh]">
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4 text-primary" />
                                Filters
                            </SheetTitle>
                        </SheetHeader>
                        <div className="overflow-y-auto px-6 pb-6">
                            {filterPanel}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
