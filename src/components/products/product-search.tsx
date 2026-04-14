"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

interface ProductSearchProps {
    className?: string;
    basePath?: string;
    placeholder?: string;
    ariaLabel?: string;
}

export function ProductSearch({
    className,
    basePath = ROUTES.PRODUCTS,
    placeholder = "Search products...",
    ariaLabel = "Search products",
}: ProductSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");

    const submitSearch = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (searchValue.trim()) {
            params.set("search", searchValue.trim());
        } else {
            params.delete("search");
        }

        params.delete("page");
        router.push(
            params.toString()
                ? `${basePath}?${params.toString()}`
                : basePath,
        );
    };

    return (
        <form className={cn("relative", className)} onSubmit={submitSearch}>
            <Search className="absolute left-4 top-6 h-4 w-4 -translate-y-1/2 text-outline md:top-1/2" />
            <Input
                placeholder={placeholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-12 rounded-lg border border-outline-variant/20 bg-surface-high pl-11 pr-4 md:pr-28"
                aria-label={ariaLabel}
            />
            <div className="flex items-center justify-end gap-1 absolute right-1.5 top-1/2 -translate-y-1/2">
                <Button
                    type="submit"
                    variant="secondary"
                    className="h-9 w-full rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest sm:w-auto"
                >
                    Search
                </Button>
            </div>
        </form>
    );
}
