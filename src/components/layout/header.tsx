import Link from "next/link";
import { LogIn, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { CartBadge } from "@/components/layout/cart-badge";
import { MobileNav } from "@/components/layout/mobile-nav";

export async function Header() {
    const user = await getCurrentUser();

    return (
        <header className="glass-header fixed inset-x-0 top-0 z-50">
            <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 py-4 lg:px-12">
                <div className="flex items-center gap-4">
                    <MobileNav user={user} />
                    <Link
                        href="/"
                        className="text-[22px] font-black tracking-tighter text-neutral-50"
                    >
                        ShopFlow
                    </Link>
                </div>

                <nav className="hidden items-center gap-8 lg:flex">
                    <Link
                        href="/products"
                        className="text-sm font-bold text-on-surface-variant transition-colors duration-300 ease-fluid hover:text-primary"
                    >
                        Products
                    </Link>
                    {user && (
                        <Link
                            href="/order"
                            className="text-sm font-bold text-on-surface-variant transition-colors duration-300 ease-fluid hover:text-primary"
                        >
                            Orders
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/products" aria-label="Search products">
                                <Search className="h-5 w-5" />
                            </Link>
                        </Button>
                        <CartBadge />
                        {user ? (
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href="/order" aria-label="Orders">
                                        <User className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <LogoutButton />
                            </div>
                        ) : (
                            <Button variant="ghost" asChild className="px-3">
                                <Link href="/login">
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
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
