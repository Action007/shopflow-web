"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { adjustCartItemAction, removeCartItemAction } from "@/actions/cart";
import type { CartItem as CartItemType } from "@/types/cart";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { toast } from "sonner";
import { APP_CONFIG } from "@/lib/constants/app-config";
import { ERRORS } from "@/lib/constants/errors";

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const {
        setCart,
        optimisticUpdateQuantity,
        optimisticAdd,
        optimisticRemove,
    } = useCartStore();

    const debouncedAdjust = useDebouncedCallback(
        async (newQuantity: number, confirmedQuantity: number) => {
            const result = await adjustCartItemAction(
                item.productId,
                newQuantity,
            );
            if (result.success && result.cart) {
                setCart(result.cart);
            } else {
                optimisticUpdateQuantity(item.productId, confirmedQuantity);
                toast.error(ERRORS.CART.UPDATE_FAILED, {
                    description: result.message || ERRORS.GENERIC.TRY_AGAIN,
                });
            }
        },
        APP_CONFIG.CART.DEBOUNCE_DELAY_MS,
    );

    const handleUpdateQuantity = (newQuantity: number) => {
        if (newQuantity < 1) return;
        const confirmedQuantity = item.quantity;
        optimisticUpdateQuantity(item.productId, newQuantity);
        debouncedAdjust(newQuantity, confirmedQuantity);
    };

    const handleRemove = async () => {
        optimisticRemove(item.productId);

        const result = await removeCartItemAction(item.productId);
        if (result.success && result.cart) {
            setCart(result.cart);
        } else {
            optimisticAdd(item);
            toast.error(ERRORS.CART.REMOVE_FAILED, {
                description: result.message || ERRORS.GENERIC.TRY_AGAIN,
            });
        }
    };

    return (
        <div className="group flex gap-4 rounded-xl bg-surface-low p-4 transition-all duration-300 ease-fluid hover:bg-surface-high">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-highest">
                {item.product.imageUrl ? (
                    <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-text-muted">
                        No image
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Link
                            href={`/products/${item.productId}`}
                            className="font-bold leading-none text-on-surface"
                        >
                            {item.product.name}
                        </Link>
                        <p className="mt-1 text-[10px] uppercase tracking-widest text-on-surface-variant">
                            {item.product.category?.name ?? "Product"}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="text-on-surface-variant transition-colors duration-300 ease-fluid hover:text-destructive"
                        onClick={handleRemove}
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-4 flex items-end justify-between gap-4">
                    <div className="flex items-center overflow-hidden rounded-lg bg-surface-highest">
                        <button
                            type="button"
                            className="px-2 py-1 transition-colors duration-300 ease-fluid hover:bg-neutral-700"
                            onClick={() => handleUpdateQuantity(item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 text-sm font-bold">
                            {item.quantity}
                        </span>
                        <button
                            type="button"
                            className="px-2 py-1 transition-colors duration-300 ease-fluid hover:bg-neutral-700"
                            onClick={() => handleUpdateQuantity(item.quantity + 1)}
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="text-right">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                            {formatPrice(item.priceAtAdd)}
                        </p>
                        <p className="text-lg font-black text-on-surface">
                            {formatPrice(
                                parseFloat(item.priceAtAdd) * item.quantity,
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
