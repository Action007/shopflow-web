"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, selectItemCount } from "@/stores/cart-store";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

interface CartBadgeProps {
    className?: string;
}

export function CartBadge({ className }: CartBadgeProps) {
    const itemCount = useCartStore(selectItemCount);

    return (
        <Button
            variant="ghost"
            size="icon"
            asChild
            className={cn("relative text-on-surface hover:text-primary", className)}
        >
            <Link href={ROUTES.CART}>
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-on-primary">
                        {itemCount > 99 ? "99+" : itemCount}
                    </span>
                )}
                <span className="sr-only">Cart ({itemCount})</span>
            </Link>
        </Button>
    );
}
