"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Store, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore, selectItemCount } from "@/stores/cart-store";
import { ROUTES } from "@/lib/constants/routes";

const items = [
    { href: ROUTES.HOME, label: "Shop", icon: Store },
    { href: ROUTES.PRODUCTS, label: "Search", icon: Search },
    { href: ROUTES.CART, label: "Cart", icon: ShoppingCart },
    { href: ROUTES.ORDERS, label: "Profile", icon: User },
] as const;

export function BottomNav() {
    const pathname = usePathname();
    const itemCount = useCartStore(selectItemCount);

    return (
        <nav className="glass-header fixed inset-x-0 bottom-0 z-50 rounded-t-lg lg:hidden">
            <div className="flex h-16 items-center justify-around px-2">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        item.href === ROUTES.HOME
                            ? pathname === ROUTES.HOME
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex scale-95 flex-col items-center justify-center rounded-xl px-3 py-1 text-neutral-500 transition-all duration-300 ease-fluid active:scale-90",
                                isActive &&
                                    "bg-blue-500/10 text-blue-400",
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-5 w-5",
                                    isActive && "fill-current stroke-[1.75]",
                                )}
                            />
                            {item.href === ROUTES.CART && itemCount > 0 && (
                                <span className="absolute -right-1 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-on-primary">
                                    {itemCount > 9 ? "9+" : itemCount}
                                </span>
                            )}
                            <span className="mt-1 text-[10px] font-bold uppercase tracking-widest">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
