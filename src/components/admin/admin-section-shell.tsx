import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminSectionShellProps {
    eyebrow?: string;
    title: string;
    description?: string;
    children?: ReactNode;
    actions?: ReactNode;
    className?: string;
    contentClassName?: string;
    headerClassName?: string;
}

export function AdminSectionShell({
    eyebrow,
    title,
    description,
    children,
    actions,
    className,
    contentClassName,
    headerClassName,
}: AdminSectionShellProps) {
    return (
        <section
            className={cn(
                "rounded-[28px] border border-outline-variant/15 bg-surface-low p-5 sm:p-6",
                className,
            )}
        >
            <div
                className={cn(
                    "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
                    headerClassName,
                )}
            >
                <div className="max-w-[60ch]">
                    {eyebrow ? (
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                            {eyebrow}
                        </p>
                    ) : null}
                    <h2 className="mt-2 font-headline text-3xl font-black tracking-[-0.03em] text-on-surface">
                        {title}
                    </h2>
                    {description ? (
                        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                            {description}
                        </p>
                    ) : null}
                </div>

                {actions ? <div>{actions}</div> : null}
            </div>

            {children ? (
                <div className={cn("mt-5", contentClassName)}>{children}</div>
            ) : null}
        </section>
    );
}
