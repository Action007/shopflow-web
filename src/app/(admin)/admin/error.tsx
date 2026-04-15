"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getApiErrorPresentation, isAuthzError } from "@/lib/api-error";
import { ROUTES } from "@/lib/constants/routes";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string; statusCode?: number };
    reset: () => void;
}) {
    const presentation = getApiErrorPresentation(error);

    return (
        <div className="rounded-[28px] border border-outline-variant/15 bg-surface-low px-6 py-12 text-center">
            <h2 className="text-3xl font-black tracking-tighter text-on-surface">
                {presentation.title}
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-sm leading-relaxed text-on-surface-variant">
                {presentation.description}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                {presentation.retryable ? (
                    <Button onClick={reset}>Try again</Button>
                ) : null}
                <Button asChild variant={presentation.retryable ? "secondary" : "default"}>
                    <Link href={ROUTES.ADMIN.ROOT}>Back to Admin</Link>
                </Button>
                {isAuthzError(error) ? (
                    <Button asChild variant="secondary">
                        <Link href={ROUTES.PRODUCTS}>Open Store</Link>
                    </Button>
                ) : null}
            </div>
        </div>
    );
}
