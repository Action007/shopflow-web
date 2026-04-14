import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminRecordShellProps {
    children: ReactNode;
    className?: string;
}

export function AdminRecordShell({
    children,
    className,
}: AdminRecordShellProps) {
    return (
        <article
            className={cn(
                "overflow-hidden rounded-[28px] border border-outline-variant/15 bg-surface-low",
                className,
            )}
        >
            {children}
        </article>
    );
}
