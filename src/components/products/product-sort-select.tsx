"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";

interface ProductSortSelectProps {
    value: string;
    className?: string;
    onChangeComplete?: () => void;
}

const options = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest Arrivals" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name" },
] as const;

export function ProductSortSelect({
    value,
    className,
    onChangeComplete,
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
        router.push(`${ROUTES.PRODUCTS}?${params.toString()}`);
        onChangeComplete?.();
    };

    return (
        <div className={cn("relative", className)}>
            <select
                value={value}
                onChange={(event) => updateSort(event.target.value)}
                className="h-12 w-full appearance-none rounded-lg border border-outline-variant/20 bg-surface-low px-4 pr-10 text-sm text-on-surface outline-none transition-all duration-300 ease-fluid focus:border-primary focus:ring-2 focus:ring-primary/25"
                aria-label="Sort products"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
        </div>
    );
}
