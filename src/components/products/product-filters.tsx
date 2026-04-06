"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
    currentCategory?: string;
    currentSort?: string;
    currentOrder?: string;
}

export function ProductFilters({
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

    return (
        <div className="mb-6 flex flex-wrap items-center gap-4">
            <Select
                value={currentSort ?? "createdAt"}
                onValueChange={(value) => updateParam("sortBy", value)}
            >
                <SelectTrigger className="w-[180px]">
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
        </div>
    );
}