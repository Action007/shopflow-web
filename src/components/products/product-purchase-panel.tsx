"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { WishlistToggleButton } from "@/components/wishlist/wishlist-toggle-button";
import { useCartStore } from "@/stores/cart-store";

interface ProductPurchasePanelProps {
    productId: string;
    inStock: boolean;
    stockQuantity: number;
    initialIsWishlisted?: boolean;
}

export function ProductPurchasePanel({
    productId,
    inStock,
    stockQuantity,
    initialIsWishlisted = false,
}: ProductPurchasePanelProps) {
    const [quantity, setQuantity] = useState(1);

    const cartQuantity = useCartStore(
        (state) =>
            state.cart?.items.find((item) => item.productId === productId)
                ?.quantity ?? 0,
    );

    const safeStockQuantity = Math.max(Math.trunc(stockQuantity), 0);
    const remainingStock = Math.max(safeStockQuantity - cartQuantity, 0);
    const canAddMore = inStock && remainingStock > 0;

    const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));
    const handleIncrease = () =>
        setQuantity((q) => Math.min(q + 1, remainingStock));

    return (
        <section className="space-y-4 lg:order-4">
            {!canAddMore ? (
                <p className="text-sm text-on-surface-variant">
                    {inStock
                        ? "All available units are already in your cart."
                        : "This product is currently unavailable."}
                </p>
            ) : (
                <p className="text-sm text-on-surface-variant">
                    {cartQuantity > 0
                        ? `${cartQuantity} already in your cart.`
                        : "Ready to ship while stock lasts."}
                </p>
            )}
            <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-low px-4 py-3 text-sm">
                <span className="font-bold uppercase tracking-widest text-outline text-[10px]">
                    Available
                </span>
                <span className="font-mono text-on-surface-variant tabular-nums">
                    {remainingStock} of {safeStockQuantity}
                </span>
            </div>
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
                            onClick={handleDecrease}
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-center w-[40px] text-lg font-bold">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface transition-colors duration-300 ease-fluid hover:bg-white/5 disabled:opacity-40"
                            aria-label="Increase quantity"
                            disabled={!canAddMore || quantity >= remainingStock}
                            onClick={handleIncrease}
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <AddToCartButton
                    productId={productId}
                    quantity={quantity}
                    disabled={!canAddMore}
                    className="w-full flex-initial px-2"
                    onAdded={() => setQuantity(1)}
                />
            </div>
            <WishlistToggleButton
                productId={productId}
                initialIsWishlisted={initialIsWishlisted}
            />
        </section>
    );
}
