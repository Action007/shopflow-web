"use client";

import { Button } from "@/components/ui/button";
import { ERRORS } from "@/lib/constants/errors";
import { getApiErrorPresentation } from "@/lib/api-error";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string; statusCode?: number };
    reset: () => void;
}) {
    const presentation = getApiErrorPresentation(error);

    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
            <h2 className="text-2xl font-bold">{presentation.title}</h2>
            <p className="mt-2 text-muted-foreground">
                {presentation.description || ERRORS.PAGES.GLOBAL}
            </p>
            {presentation.retryable ? (
                <Button onClick={reset} className="mt-6">
                    Try again
                </Button>
            ) : null}
        </div>
    );
}
