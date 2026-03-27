"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    meta: {
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

export function Pagination({ meta }: PaginationProps) {
    const searchParams = useSearchParams();

    if (meta.totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        return `/products?${params.toString()}`;
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="outline"
                size="sm"
                asChild
                disabled={!meta.hasPrevious}
            >
                {meta.hasPrevious ? (
                    <Link href={createPageUrl(meta.page - 1)}>
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                    </Link>
                ) : (
                    <span>
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                    </span>
                )}
            </Button>

            <span className="px-4 text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
            </span>

            <Button
                variant="outline"
                size="sm"
                asChild
                disabled={!meta.hasNext}
            >
                {meta.hasNext ? (
                    <Link href={createPageUrl(meta.page + 1)}>
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                ) : (
                    <span>
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </span>
                )}
            </Button>
        </div>
    );
}
