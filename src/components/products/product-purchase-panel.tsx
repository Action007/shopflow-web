"use client";

import { useState } from "react";
import { Minus, Plus, Heart } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Button } from "@/components/ui/button";

interface ProductPurchasePanelProps {
    productId: string;
    inStock: boolean;
}

export function ProductPurchasePanel({
    productId,
    inStock,
}: ProductPurchasePanelProps) {
    const [quantity, setQuantity] = useState(1);

    return (
        <section className="space-y-4 lg:order-4">
            <div className="flex w-full flex-wrap gap-2 sm:flex-nowrap">
                <div className="flex w-full sm:w-[200px] items-center justify-between sm:justify-center rounded-xl bg-surface-highest p-2 px-6 sm:px-2 gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 sm:hidden">
                        Quantity
                    </span>
                    <div className="flex items-center sm:w-full sm:justify-around">
                        <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface transition-colors duration-300 ease-fluid hover:bg-white/5 disabled:opacity-40"
                            aria-label="Decrease quantity"
                            disabled={quantity <= 1}
                            onClick={() =>
                                setQuantity((current) =>
                                    Math.max(1, current - 1),
                                )
                            }
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-center w-[40px] text-lg font-bold">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface transition-colors duration-300 ease-fluid hover:bg-white/5"
                            aria-label="Increase quantity"
                            onClick={() =>
                                setQuantity((current) => current + 1)
                            }
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <AddToCartButton
                    productId={productId}
                    quantity={quantity}
                    disabled={!inStock}
                    className="w-full flex-initial px-2"
                    onAdded={() => setQuantity(0)}
                />
            </div>
            <Button
                variant="outline"
                className="w-full justify-center gap-2 py-4 text-xs uppercase tracking-widest"
            >
                <Heart className="h-[18px] w-[18px]" />
                Save to Wishlist
            </Button>
        </section>
    );
}
