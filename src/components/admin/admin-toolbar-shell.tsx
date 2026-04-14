import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AdminSectionShell } from "./admin-section-shell";

interface AdminToolbarShellProps {
    eyebrow: string;
    title: string;
    description: string;
    children: ReactNode;
    className?: string;
    controlsClassName?: string;
}

export function AdminToolbarShell({
    eyebrow,
    title,
    description,
    children,
    className,
    controlsClassName,
}: AdminToolbarShellProps) {
    return (
        <AdminSectionShell
            eyebrow={eyebrow}
            title={title}
            description={description}
            className={className}
            contentClassName={cn("mt-4", controlsClassName)}
        >
            {children}
        </AdminSectionShell>
    );
}
