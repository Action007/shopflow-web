"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Headphones,
    Heart,
    LogIn,
    LogOut,
    Menu,
    Package,
    Shield,
    ShoppingCart,
    Store,
    User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { logoutAction } from "@/actions/auth";
import type { User } from "@/types/user";
import { ROUTES } from "@/lib/constants/routes";
import { useCartStore, selectItemCount } from "@/stores/cart-store";
import { canAccessShopperFeatures, isAdmin } from "@/lib/roles";

interface NavLink {
    href: string;
    label: string;
    icon: React.ElementType;
    withBadge?: boolean;
}

interface MobileNavProps {
    user: User | null;
}

export function MobileNav({ user }: MobileNavProps) {
    const [open, setOpen] = useState(false);
    const itemCount = useCartStore(selectItemCount);
    const adminMode = isAdmin(user);

    const links: NavLink[] = adminMode
        ? [
              { href: ROUTES.PRODUCTS, label: "Products", icon: Store },
              { href: ROUTES.SUPPORT, label: "Support", icon: Headphones },
              { href: ROUTES.ADMIN.ROOT, label: "Admin", icon: Shield },
              { href: ROUTES.PROFILE, label: "Profile", icon: UserIcon },
          ]
        : [
              { href: ROUTES.PRODUCTS, label: "Products", icon: Store },
              { href: ROUTES.WISHLIST, label: "Wishlist", icon: Heart },
              { href: ROUTES.ORDERS, label: "Orders", icon: Package },
              { href: ROUTES.SUPPORT, label: "Support", icon: Headphones },
              { href: ROUTES.CART, label: "Cart", icon: ShoppingCart, withBadge: true },
              { href: ROUTES.PROFILE, label: "Profile", icon: UserIcon },
          ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-on-surface">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm border-outline-variant/15 bg-background/90">
                <SheetHeader className="border-b border-outline-variant/10 pb-6">
                    <SheetTitle className="text-[22px] tracking-tighter">ShopFlow</SheetTitle>
                </SheetHeader>

                <nav className="flex flex-1 flex-col gap-8 px-6 pb-6">
                    <div className="space-y-3">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-between rounded-xl bg-surface-low px-4 py-4 text-sm font-bold tracking-tight text-on-surface transition-colors duration-300 ease-fluid hover:bg-surface-high"
                            >
                                <div className="flex items-center gap-3">
                                    <link.icon className="h-4 w-4 text-primary" />
                                    <span>{link.label}</span>
                                </div>
                                {link.withBadge && itemCount > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-on-primary">
                                        {itemCount > 99 ? "99+" : itemCount}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto space-y-4 rounded-xl bg-surface-low p-4">
                        {user ? (
                            <>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Signed In</p>
                                    <p className="font-bold text-on-surface">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs font-bold uppercase tracking-widest text-primary">{user.role}</p>
                                </div>
                                <form action={logoutAction}>
                                    <Button type="submit" variant="outline" className="w-full justify-center">
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <Link href={ROUTES.LOGIN} onClick={() => setOpen(false)}>
                                <Button variant="secondary" className="h-10 w-full justify-center rounded-full px-4 text-on-surface">
                                    <LogIn className="h-4 w-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Login</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}