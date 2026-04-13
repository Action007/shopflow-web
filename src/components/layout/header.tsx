import Link from "next/link";
import { LogIn, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { CartBadge } from "@/components/layout/cart-badge";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ROUTES } from "@/lib/constants/routes";
import { canAccessShopperFeatures, isAdmin } from "@/lib/roles";

export async function Header() {
    const user = await getCurrentUser();
    const shopperMode = canAccessShopperFeatures(user);
    const adminMode = isAdmin(user);
    const navItems = adminMode
        ? [
              { href: ROUTES.PRODUCTS, label: "Products" },
              { href: ROUTES.SUPPORT, label: "Support" },
              { href: ROUTES.ADMIN.ROOT, label: "Admin" },
          ]
        : [
              { href: ROUTES.PRODUCTS, label: "Products" },
              { href: ROUTES.ORDERS, label: "Orders" },
              { href: ROUTES.WISHLIST, label: "Wishlist" },
              { href: ROUTES.SUPPORT, label: "Support" },
          ];

    return (
        <header className="glass-header fixed inset-x-0 top-0 z-50">
                <div className="site-container flex w-full items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                        <MobileNav user={user} />
                        <Link
                            href={ROUTES.HOME}
                            className="text-[22px] font-black tracking-tighter text-neutral-50"
                        >
                            ShopFlow
                        </Link>
                    </div>

                    <nav className="hidden items-center gap-8 lg:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-md font-bold text-on-surface-variant transition-colors duration-300 ease-fluid hover:text-primary"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <div className="hidden items-center gap-2 lg:flex">
                            {shopperMode && <CartBadge />}

                            {user ? (
                                <>
                                    {adminMode && (
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link
                                                href={ROUTES.ADMIN.ROOT}
                                                aria-label="Admin"
                                            >
                                                <Shield className="h-5 w-5" />
                                            </Link>
                                        </Button>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                        >
                                            <Link
                                                href={ROUTES.PROFILE}
                                                aria-label="Profile"
                                            >
                                                <User className="h-5 w-5" />
                                            </Link>
                                        </Button>
                                        <LogoutButton />
                                    </div>
                                </>
                            ) : (
                                <Button variant="ghost" asChild className="px-3">
                                    <Link href={ROUTES.LOGIN}>
                                        <LogIn className="h-4 w-4" />
                                        Login
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {user ? (
                            <div className="lg:hidden">
                                <LogoutButton />
                            </div>
                        ) : (
                            <Button
                                variant="ghost"
                                asChild
                                className="px-0 text-neutral-400 hover:bg-transparent hover:text-blue-400 lg:hidden"
                            >
                                <Link href={ROUTES.LOGIN}>Login</Link>
                            </Button>
                        )}
                    </div>
                </div>
        </header>
    );
}
