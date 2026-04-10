import Link from "next/link";
import { LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { CartBadge } from "@/components/layout/cart-badge";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ROUTES } from "@/lib/constants/routes";

export async function Header() {
    const user = await getCurrentUser();

    return (
        <header className="glass-header fixed inset-x-0 top-0 z-50">
            <div className="mx-4">
                <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between py-2">
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
                        <Link
                            href={ROUTES.PRODUCTS}
                            className="text-md font-bold text-on-surface-variant transition-colors duration-300 ease-fluid hover:text-primary"
                        >
                            Products
                        </Link>
                        <Link
                            href={ROUTES.SUPPORT}
                            className="text-md font-bold text-on-surface-variant transition-colors duration-300 ease-fluid hover:text-primary"
                        >
                            Support
                        </Link>
                        <Link
                            href={ROUTES.ORDERS}
                            className="text-md font-bold text-on-surface-variant transition-colors duration-300 ease-fluid hover:text-primary"
                        >
                            Orders
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        <div className="hidden items-center gap-2 lg:flex">
                            {user ? (
                                <>
                                    <CartBadge />
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
                                <Button
                                    variant="ghost"
                                    asChild
                                    className="px-3"
                                >
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
            </div>
        </header>
    );
}
