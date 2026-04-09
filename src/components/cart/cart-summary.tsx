"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    useCartStore,
    selectItemCount,
    selectTotalPrice,
} from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";

export function CartSummary() {
    const itemCount = useCartStore(selectItemCount);
    const totalPrice = useCartStore(selectTotalPrice);

    return (
        <aside className="lg:sticky lg:top-24">
            <div className="rounded-xl bg-surface-low p-6">
                <h2 className="mb-6 hidden text-xl font-black uppercase tracking-tighter lg:block">
                    Order Summary
                </h2>

                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2 lg:px-0">
                        <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                            Subtotal
                        </span>
                        <span className="font-bold text-on-surface">
                            {formatPrice(totalPrice)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between px-2 lg:px-0">
                        <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                            Shipping
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                            Free
                        </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-outline-variant/20 px-2 pt-6 lg:px-0">
                        <span className="text-xl font-black tracking-tighter">
                            Total
                        </span>
                        <span className="text-3xl font-black tracking-tight text-primary">
                            {formatPrice(totalPrice)}
                        </span>
                    </div>
                </section>

                {itemCount === 0 ? (
                    <Button className="mt-8 w-full" disabled>
                        Proceed to Checkout
                    </Button>
                ) : (
                    <Button asChild className="mt-8 w-full rounded-lg text-lg">
                        <Link href={ROUTES.CHECKOUT}>
                            Proceed to Checkout
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                )}

                <div className="mt-8 flex flex-col items-center gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                        Guaranteed Safe Checkout
                    </p>
                    <div className="flex justify-center gap-6 opacity-40 grayscale contrast-125">
                        <span className="text-xs font-bold tracking-widest">VISA</span>
                        <span className="text-xs font-bold tracking-widest">MC</span>
                        <span className="text-xs font-bold tracking-widest">PAYPAL</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
