"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants/routes";

interface PriceRangeFormProps {
    initialMinPrice?: string;
    initialMaxPrice?: string;
    onApply?: () => void;
    basePath?: string;
}

export function PriceRangeForm({
    initialMinPrice,
    initialMaxPrice,
    onApply,
    basePath = ROUTES.PRODUCTS,
}: PriceRangeFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [minPriceValue, setMinPriceValue] = useState(initialMinPrice ?? "");
    const [maxPriceValue, setMaxPriceValue] = useState(initialMaxPrice ?? "");

    const applyPriceRange = (nextMinPrice: string, nextMaxPrice: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (nextMinPrice.trim()) {
            params.set("minPrice", nextMinPrice.trim());
        } else {
            params.delete("minPrice");
        }

        if (nextMaxPrice.trim()) {
            params.set("maxPrice", nextMaxPrice.trim());
        } else {
            params.delete("maxPrice");
        }

        params.delete("page");
        router.push(
            params.toString()
                ? `${basePath}?${params.toString()}`
                : basePath,
        );
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        applyPriceRange(minPriceValue, maxPriceValue);
        onApply?.();
    };

    const clearPriceRange = () => {
        setMinPriceValue("");
        setMaxPriceValue("");
        applyPriceRange("", "");
    };

    return (
        <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
                <Input
                    value={minPriceValue}
                    onChange={(event) =>
                        setMinPriceValue(event.currentTarget.value)
                    }
                    placeholder="Min"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="0.01"
                    className="border border-outline-variant/20 bg-surface-low"
                    aria-label="Minimum price"
                />
                <Input
                    value={maxPriceValue}
                    onChange={(event) =>
                        setMaxPriceValue(event.currentTarget.value)
                    }
                    placeholder="Max"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="0.01"
                    className="border border-outline-variant/20 bg-surface-low"
                    aria-label="Maximum price"
                />
            </div>
            <div className="flex items-center gap-2">
                <Button
                    type="submit"
                    variant={
                        minPriceValue || maxPriceValue ? "secondary" : "ghost"
                    }
                    size="sm"
                    className="flex-1 border border-outline-variant/20"
                >
                    Apply
                </Button>
                {(minPriceValue || maxPriceValue) && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="border border-outline-variant/20"
                        onClick={clearPriceRange}
                    >
                        Clear
                    </Button>
                )}
            </div>
        </form>
    );
}
