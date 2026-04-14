"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { FormSelect } from "@/components/shared/form-select";

interface ProductSortSelectProps {
    value: string;
    className?: string;
    onChangeComplete?: () => void;
    basePath?: string;
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
    basePath = ROUTES.PRODUCTS,
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
        router.push(`${basePath}?${params.toString()}`);
        onChangeComplete?.();
    };

    return (
        <FormSelect
            value={value}
            options={options}
            onChange={updateSort}
            className={className}
            ariaLabel="Sort products"
        />
    );
}
