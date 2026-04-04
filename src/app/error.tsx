"use client";

import { Button } from "@/components/ui/button";
import { ERRORS } from "@/lib/constants/errors";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="mt-2 text-muted-foreground">
                {error.message || ERRORS.PAGES.GLOBAL}
            </p>
            <Button onClick={reset} className="mt-6">
                Try again
            </Button>
        </div>
    );
}
