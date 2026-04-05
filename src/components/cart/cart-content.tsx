"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { ROUTES } from "@/lib/constants/routes";

export function CartContent() {
    const cart = useCartStore((state) => state.cart);

    if (!cart || cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">
                    Your cart is empty
                </h2>
                <p className="mt-2 text-muted-foreground">
                    Add some products to get started.
                </p>
                <Button asChild className="mt-6">
                    <Link href={ROUTES.PRODUCTS}>Browse products</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>
            <div>
                <CartSummary />
            </div>
        </div>
    );
}
