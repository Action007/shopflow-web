"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, selectItemCount } from "@/stores/cart-store";
import { ROUTES } from "@/lib/constants/routes";

export function CartBadge() {
    const itemCount = useCartStore(selectItemCount);

    return (
        <Button variant="ghost" size="icon" asChild className="relative">
            <Link href={ROUTES.CART}>
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {itemCount > 99 ? "99+" : itemCount}
                    </span>
                )}
                <span className="sr-only">Cart ({itemCount})</span>
            </Link>
        </Button>
    );
}
