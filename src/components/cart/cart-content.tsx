"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { CartContentSkeleton } from "./cart-content-skeleton";
import { ROUTES } from "@/lib/constants/routes";

export function CartContent() {
    const cart = useCartStore((state) => state.cart);
    const isInitialized = useCartStore((state) => state.isInitialized);
    const itemCount = cart?.items.length ?? 0;

    if (!isInitialized) {
        return <CartContentSkeleton />;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <section className="rounded-3xl bg-surface-low px-6 py-12 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-highest">
                    <ShoppingBag className="h-8 w-8 text-neutral-500" />
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight">
                    Your cart is empty
                </h3>
                <p className="mx-auto mb-8 max-w-[200px] text-sm text-neutral-400">
                    Looks like you haven&apos;t added any obsidian treasures
                    yet.
                </p>
                <Button asChild className="w-full">
                    <Link href={ROUTES.PRODUCTS}>Browse Products</Link>
                </Button>
            </section>
        );
    }

    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-black leading-tight tracking-tighter text-on-surface">
                    Your Cart{" "}
                    <span className="ml-2 align-top text-2xl font-normal text-on-surface-variant">
                        ({itemCount})
                    </span>
                </h1>
            </div>

            <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
                <div className="space-y-6">
                    {cart.items.map((item) => (
                        <CartItem
                            key={`${item.id}-${item.quantity}`}
                            item={item}
                        />
                    ))}
                </div>
                <div className="mt-12 lg:mt-0">
                    <CartSummary />
                </div>
            </div>
        </>
    );
}
