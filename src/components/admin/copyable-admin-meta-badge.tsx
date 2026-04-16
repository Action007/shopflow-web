"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyableAdminMetaBadgeProps {
    label: string;
    value: string;
    displayValue?: string;
    copiedLabel?: string;
    className?: string;
}

export function CopyableAdminMetaBadge({
    label,
    value,
    displayValue,
    copiedLabel = "Copied",
    className,
}: CopyableAdminMetaBadgeProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setIsCopied(true);
            toast.success(`${label} copied`);
            window.setTimeout(() => setIsCopied(false), 1500);
        } catch {
            toast.error(`Could not copy ${label.toLowerCase()}`);
        }
    };

    return (
        <button
            type="button"
            onClick={() => void handleCopy()}
            className={cn(
                "inline-flex items-center gap-2 rounded-full border border-outline-variant/15 bg-surface-high px-3 py-1.5 text-xs transition-colors duration-300 ease-fluid hover:bg-surface-highest",
                className,
            )}
            aria-label={`Copy ${label}`}
            title={`Copy ${label}: ${value}`}
        >
            <span className="font-bold text-on-surface">
                {isCopied ? copiedLabel : displayValue ?? value}
            </span>
            <span className="text-on-surface-variant">{label}</span>
            {isCopied ? (
                <Check className="h-3 w-3 text-primary" />
            ) : (
                <Copy className="h-3 w-3 text-outline" />
            )}
        </button>
    );
}
