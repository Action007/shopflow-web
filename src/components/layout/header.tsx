import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold">
                    ShopNext
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/products"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Products
                    </Link>
                </nav>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/cart">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">Cart</span>
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/login">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Account</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
