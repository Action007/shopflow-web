"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
    value: string;
    label: string;
}

interface FormSelectProps {
    value: string;
    options: readonly SelectOption[] | SelectOption[];
    onChange: (value: string) => void;
    className?: string;
    ariaLabel: string;
}

export function FormSelect({
    value,
    options,
    onChange,
    className,
    ariaLabel,
}: FormSelectProps) {
    return (
        <div className={cn("relative", className)}>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-12 w-full appearance-none rounded-lg border border-outline-variant/20 bg-surface-high px-4 pr-10 text-sm text-on-surface outline-none transition-all duration-300 ease-fluid focus:border-primary focus:ring-2 focus:ring-primary/25"
                aria-label={ariaLabel}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
        </div>
    );
}
