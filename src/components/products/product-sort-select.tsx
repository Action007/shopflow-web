"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import {
    applyProductSortValue,
    isProductSortValue,
    type ProductSortValue,
} from "@/lib/product-sort";
import { FormSelect } from "@/components/shared/form-select";

interface ProductSortSelectProps {
    value: string;
    className?: string;
    onChangeComplete?: () => void;
    basePath?: string;
}

const options: Array<{ value: ProductSortValue; label: string }> = [
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
        if (!isProductSortValue(nextValue)) {
            return;
        }

        const params = new URLSearchParams(searchParams.toString());
        applyProductSortValue(params, nextValue);

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
