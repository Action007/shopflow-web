"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { Category } from "@/types/product";

interface ProductFiltersProps {
    categories: Category[];
    currentCategory?: string;
    currentSort?: string;
    currentOrder?: string;
}

export function ProductFilters({
    categories,
    currentCategory,
    currentSort,
    currentOrder,
}: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

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

    const clearAllFilters = () => {
        router.push(ROUTES.PRODUCTS);
    };

    const hasActiveFilters = !!currentCategory;

    return (
        <div className="mb-6 flex flex-wrap items-center gap-4">
            {categories.length > 0 && (
                <Select
                    value={currentCategory ?? "all"}
                    onValueChange={(value) => updateParam("categoryId", value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            <Select
                value={currentSort ?? "createdAt"}
                onValueChange={(value) => updateParam("sortBy", value)}
            >
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="createdAt">Newest</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={currentOrder ?? "desc"}
                onValueChange={(value) => updateParam("sortOrder", value)}
            >
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
            </Select>

            {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    <X className="mr-1 h-4 w-4" />
                    Clear filters
                </Button>
            )}
        </div>
    );
}
