"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableFormShellProps {
    eyebrow: string;
    title: string;
    description?: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    collapsible?: boolean;
    className?: string;
    contentClassName?: string;
    headerAside?: React.ReactNode;
}

export function ExpandableFormShell({
    eyebrow,
    title,
    description,
    children,
    defaultExpanded = true,
    collapsible = true,
    className,
    contentClassName,
    headerAside,
}: ExpandableFormShellProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const headerContent = (
        <>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                    {eyebrow}
                </p>
                <h2 className="mt-2 font-headline text-2xl font-black tracking-[-0.03em] text-on-surface">
                    {title}
                </h2>
                {description ? (
                    <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                        {description}
                    </p>
                ) : null}
            </div>

            <div className="flex items-start gap-3">
                {headerAside}
                {collapsible ? (
                    <span className="mt-1 inline-flex rounded-full bg-surface-high p-2 text-on-surface-variant">
                        <ChevronDown
                            className={cn(
                                "h-5 w-5 transition-transform duration-300",
                                isExpanded && "rotate-180",
                            )}
                        />
                    </span>
                ) : null}
            </div>
        </>
    );

    return (
        <div
            className={cn(
                "space-y-5 rounded-[28px] border border-outline-variant/15 bg-surface-low p-6",
                className,
            )}
        >
            {collapsible ? (
                <button
                    type="button"
                    onClick={() => setIsExpanded((current) => !current)}
                    className="flex w-full items-start justify-between gap-4 text-left"
                    aria-expanded={isExpanded}
                >
                    {headerContent}
                </button>
            ) : (
                <div className="flex items-start justify-between gap-4">
                    {headerContent}
                </div>
            )}

            {isExpanded ? (
                <div className={cn("space-y-5", contentClassName)}>{children}</div>
            ) : null}
        </div>
    );
}
