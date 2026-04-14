"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Boxes,
    ClipboardList,
    Shield,
    Tags,
    Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminNavLink {
    href: string;
    label: string;
    description: string;
    icon: "overview" | "products" | "categories" | "users" | "orders";
}

interface AdminSidebarNavProps {
    links: readonly AdminNavLink[];
}

const iconMap = {
    overview: Shield,
    products: Boxes,
    categories: Tags,
    users: Users,
    orders: ClipboardList,
} as const;

function isActivePath(pathname: string, href: string) {
    if (href === "/admin") {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav({ links }: AdminSidebarNavProps) {
    const pathname = usePathname();

    return (
        <nav className="rounded-[28px] border border-outline-variant/15 bg-surface-low p-3 sm:p-4">
            <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-primary/70">
                Workspace
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:block lg:space-y-3">
                {links.map((link) => {
                    const Icon = iconMap[link.icon];
                    const isActive = isActivePath(pathname, link.href);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                                "group block rounded-[22px] border px-4 py-4 border border-outline-variant/15 transition-all duration-300 ease-fluid",
                                isActive
                                    ? "border-primary/20 bg-primary/10 shadow-[0_10px_30px_rgba(77,142,255,0.12)]"
                                    : "hover:border-outline-variant/10 hover:bg-surface-high",
                            )}
                        >
                            <div className="flex items-center gap-3 lg:items-start">
                                <div
                                    className={cn(
                                        "rounded-full p-2 transition-colors duration-300 ease-fluid",
                                        isActive
                                            ? "bg-primary text-on-primary"
                                            : "bg-primary/10 text-primary group-hover:bg-primary/15",
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className={cn(
                                            "font-bold text-sm sm:text-base",
                                            isActive
                                                ? "text-on-surface"
                                                : "text-on-surface",
                                        )}
                                    >
                                        {link.label}
                                    </p>
                                    <p
                                        className={cn(
                                            "hidden text-sm leading-snug lg:block",
                                            isActive
                                                ? "text-on-surface/80"
                                                : "text-on-surface-variant",
                                        )}
                                    >
                                        {link.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
