"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { ROUTES } from "@/lib/constants/routes";
import { APP_CONFIG } from "@/lib/constants/app-config";
import { cn } from "@/lib/utils";

interface ProductSearchProps {
    className?: string;
}

export function ProductSearch({ className }: ProductSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("search") ?? "");

    const navigate = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
            params.set("search", value.trim());
        } else {
            params.delete("search");
        }
        params.delete("page");
        router.push(`${ROUTES.PRODUCTS}?${params.toString()}`);
    }, APP_CONFIG.SEARCH.DEBOUNCE_DELAY_MS);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        navigate(e.target.value);
    };

    const handleClear = () => {
        setQuery("");
        navigate("");
    };

    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
            <Input
                placeholder="Search products..."
                value={query}
                onChange={handleChange}
                className="h-12 rounded-lg border border-outline-variant/20 bg-surface-high pl-11 pr-11"
                aria-label="Search products"
            />
            {query && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1.5 top-1/2 h-8 w-8 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                    onClick={handleClear}
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
