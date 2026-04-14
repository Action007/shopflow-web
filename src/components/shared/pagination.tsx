"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

interface PaginationProps {
    meta: {
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
    basePath?: string;
}

export function Pagination({
    meta,
    basePath = ROUTES.PRODUCTS,
}: PaginationProps) {
    const searchParams = useSearchParams();

    if (meta.totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        return `${basePath}?${params.toString()}`;
    };

    const getPages = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];
        const { page, totalPages } = meta;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);
        if (page > 3) pages.push("...");
        for (
            let i = Math.max(2, page - 1);
            i <= Math.min(totalPages - 1, page + 1);
            i++
        ) {
            pages.push(i);
        }
        if (page < totalPages - 2) pages.push("...");
        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 text-outline hover:bg-surface-high"
                asChild
                disabled={!meta.hasPrevious}
            >
                {meta.hasPrevious ? (
                    <Link
                        href={createPageUrl(meta.page - 1)}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                ) : (
                    <span>
                        <ChevronLeft className="h-4 w-4" />
                    </span>
                )}
            </Button>

            {getPages().map((p, i) =>
                p === "..." ? (
                    <span
                        key={`ellipsis-${i}`}
                        className="mx-1 text-outline"
                    >
                        ...
                    </span>
                ) : (
                    <Button
                        key={p}
                        variant={p === meta.page ? "secondary" : "ghost"}
                        size="icon"
                        className={
                            p === meta.page
                                ? "h-10 w-10 bg-primary-container/20 font-bold text-primary hover:bg-primary-container/20"
                                : "h-10 w-10 text-outline hover:bg-surface-high"
                        }
                        asChild={p !== meta.page}
                    >
                        {p === meta.page ? (
                            <span aria-current="page">{p}</span>
                        ) : (
                            <Link
                                href={createPageUrl(p)}
                                aria-label={`Page ${p}`}
                            >
                                {p}
                            </Link>
                        )}
                    </Button>
                ),
            )}

            <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 text-outline hover:bg-surface-high"
                asChild
                disabled={!meta.hasNext}
            >
                {meta.hasNext ? (
                    <Link
                        href={createPageUrl(meta.page + 1)}
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <span>
                        <ChevronRight className="h-4 w-4" />
                    </span>
                )}
            </Button>
        </div>
    );
}
