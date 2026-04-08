"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ERRORS } from "@/lib/constants/errors";
import { ROUTES } from "@/lib/constants/routes";

export default function ShopError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="mt-2 text-muted-foreground">
                {error.message || ERRORS.PAGES.SHOP}
            </p>
            <div className="mt-6 flex gap-4">
                <Button onClick={reset}>Try again</Button>
                <Button variant="outline" asChild>
                    <Link href={ROUTES.HOME}>Go home</Link>
                </Button>
            </div>
        </div>
    );
}
