"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ERRORS } from "@/lib/constants/errors";
import { ROUTES } from "@/lib/constants/routes";
import { getApiErrorPresentation } from "@/lib/api-error";

export default function ShopError({
    error,
    reset,
}: {
    error: Error & { digest?: string; statusCode?: number };
    reset: () => void;
}) {
    const presentation = getApiErrorPresentation(error);

    return (
        <div className="site-container flex flex-col items-center justify-center py-24">
            <h2 className="text-2xl font-bold">{presentation.title}</h2>
            <p className="mt-2 text-muted-foreground">
                {presentation.description || ERRORS.PAGES.SHOP}
            </p>
            <div className="mt-6 flex gap-4">
                {presentation.retryable ? (
                    <Button onClick={reset}>Try again</Button>
                ) : null}
                <Button variant="outline" asChild>
                    <Link href={ROUTES.HOME}>Go to Homepage</Link>
                </Button>
            </div>
        </div>
    );
}
