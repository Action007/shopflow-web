"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

interface AuthShellProps {
    children: React.ReactNode;
    brandSize?: "sm" | "lg";
    cardClassName?: string;
    footer?: React.ReactNode;
    backgroundVariant?: "login" | "register";
}

export function AuthShell({
    children,
    brandSize = "sm",
    cardClassName,
    footer,
    backgroundVariant = "login",
}: AuthShellProps) {
    return (
        <main className="relative flex w-full max-w-md flex-col items-center">
            <div className="mb-12">
                <Link
                    href={ROUTES.HOME}
                    className={cn(
                        "font-black tracking-tighter text-on-surface transition-colors duration-300 ease-fluid hover:text-primary",
                        brandSize === "sm" ? "text-[22px]" : "text-[28px]",
                    )}
                >
                    ShopFlow
                </Link>
            </div>

            <div
                className={cn(
                    "w-full rounded-xl border bg-surface-low p-6 sm:p-8",
                    backgroundVariant === "login"
                        ? "border-outline-variant/10 shadow-2xl"
                        : "relative overflow-hidden border-white/5",
                    cardClassName,
                )}
            >
                {backgroundVariant === "register" ? (
                    <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
                ) : null}
                <div className={cn(backgroundVariant === "register" && "relative z-10")}>
                    {children}
                </div>
            </div>

            {footer ? <div className="mt-8">{footer}</div> : null}

            {backgroundVariant === "login" ? (
                <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
            ) : (
                <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
                    <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface-high opacity-20 blur-[140px]" />
                </div>
            )}
        </main>
    );
}
