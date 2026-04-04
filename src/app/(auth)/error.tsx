"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ERRORS } from "@/lib/constants/errors";
import { ROUTES } from "@/lib/constants/routes";

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <h2 className="text-2xl font-bold">Authentication error</h2>
            <p className="mt-2 text-muted-foreground">
                {error.message || ERRORS.PAGES.AUTH}
            </p>
            <div className="mt-6 flex gap-4">
                <Button onClick={reset}>Try again</Button>
                <Button variant="outline" asChild>
                    <Link href={ROUTES.LOGIN}>Back to login</Link>
                </Button>
            </div>
        </div>
    );
}
