import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { CartBadge } from "@/components/layout/cart-badge";
import { MobileNav } from "@/components/layout/mobile-nav";

export async function Header() {
    const user = await getCurrentUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <MobileNav user={user} />
                    <Link href="/" className="text-xl font-bold">
                        ShopNext
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/products"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Products
                    </Link>
                    {user && (
                        <Link
                            href="/orders"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Orders
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    <CartBadge />

                    {user ? (
                        <div className="flex items-center gap-2">
                            <span className="hidden md:inline text-sm text-muted-foreground">
                                {user.firstName}
                            </span>
                            <LogoutButton />
                        </div>
                    ) : (
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/login">
                                <User className="h-5 w-5" />
                                <button className="sr-only">Login</button>
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
