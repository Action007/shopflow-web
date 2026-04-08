"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProductSortSelectProps {
    value: string;
    className?: string;
}

export function ProductSortSelect({
    value,
    className,
}: ProductSortSelectProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateSort = (nextValue: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (nextValue === "featured") {
            params.delete("sortBy");
            params.delete("sortOrder");
        } else if (nextValue === "price-asc") {
            params.set("sortBy", "price");
            params.set("sortOrder", "asc");
        } else if (nextValue === "price-desc") {
            params.set("sortBy", "price");
            params.set("sortOrder", "desc");
        } else if (nextValue === "name-asc") {
            params.set("sortBy", "name");
            params.set("sortOrder", "asc");
        } else {
            params.set("sortBy", "createdAt");
            params.set("sortOrder", "desc");
        }

        params.delete("page");
        router.push(`/products?${params.toString()}`);
    };

    return (
        <Select value={value} onValueChange={updateSort}>
            <SelectTrigger className={className}>
                <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name</SelectItem>
            </SelectContent>
        </Select>
    );
}
