"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SubmitEventHandler, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

interface ProductSearchProps {
    className?: string;
}

export function ProductSearch({ className }: ProductSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");

    const submitSearch: SubmitEventHandler<HTMLFormElement> = (e) => {
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
                ? `${ROUTES.PRODUCTS}?${params.toString()}`
                : ROUTES.PRODUCTS,
        );
    };


    return (
        <form className={cn("relative", className)} onSubmit={submitSearch}>
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
            <Input
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-12 rounded-lg border border-outline-variant/20 bg-surface-high pl-11 pr-28"
                aria-label="Search products"
            />
            <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
                <Button
                    type="submit"
                    variant="secondary"
                    className="h-9 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest"
                >
                    Search
                </Button>
            </div>
        </form>
    );
}
