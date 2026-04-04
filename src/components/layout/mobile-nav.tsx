"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, Package, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { logoutAction } from "@/actions/auth";
import { ROUTES } from "@/lib/constants/routes";
import type { User } from "@/types/user";

interface MobileNavProps {
    user: User | null;
}

export function MobileNav({ user }: MobileNavProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
                <SheetHeader>
                    <SheetTitle>ShopNext</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-4">
                    <Link
                        href={ROUTES.PRODUCTS}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 text-sm font-medium"
                    >
                        Products
                    </Link>
                    <Link
                        href={ROUTES.CART}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 text-sm font-medium"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Cart
                    </Link>
                    {user && (
                        <Link
                            href={ROUTES.ORDERS}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 text-sm font-medium"
                        >
                            <Package className="h-4 w-4" />
                            Orders
                        </Link>
                    )}

                    <div className="my-2 border-t" />

                    {user ? (
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Signed in as {user.firstName} {user.lastName}
                            </p>
                            <form action={logoutAction}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="submit"
                                    className="w-full"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/login" onClick={() => setOpen(false)}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                            >
                                <LogIn className="mr-2 h-4 w-4" />
                                Login
                            </Button>
                        </Link>
                    )}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
