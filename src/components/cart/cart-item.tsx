"use client";

import { useEffect, useState } from "react";
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
import { AppImage } from "@/components/shared/app-image";

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const setCart = useCartStore((state) => state.setCart);
    const [localQuantity, setLocalQuantity] = useState<number>(
        item.quantity ?? 0,
    );
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        setLocalQuantity(item.quantity);
    }, [item.quantity]);

    const debouncedAdjust = useDebouncedCallback(
        async (newQuantity: number) => {
            setIsUpdating(true);
            const result = await adjustCartItemAction(
                item.productId,
                newQuantity,
            );
            if (result.success && result.cart) {
                setCart(result.cart);
            } else {
                setLocalQuantity(item.quantity);
                toast.error(ERRORS.CART.UPDATE_FAILED, {
                    description: result.message || ERRORS.GENERIC.TRY_AGAIN,
                });
            }
            setIsUpdating(false);
        },
        APP_CONFIG.CART.DEBOUNCE_DELAY_MS,
    );

    const handleUpdateQuantity = (delta: number) => {
        const newQty = localQuantity + delta;
        if (newQty < 1) {
            handleRemove();
            return;
        }
        setLocalQuantity(newQty);
        debouncedAdjust(newQty);
    };

    const handleRemove = async () => {
        const result = await removeCartItemAction(item.productId);
        if (result.success && result.cart) {
            setCart(result.cart);
        } else {
            toast.error(ERRORS.CART.REMOVE_FAILED, {
                description: result.message || ERRORS.GENERIC.TRY_AGAIN,
            });
        }
    };

    return (
        <div className="group flex gap-4 rounded-xl bg-surface-low p-4 transition-all duration-300 ease-fluid hover:bg-surface-high">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-highest">
                {item.product.imageUrl ? (
                    <AppImage
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
                        aria-label={`Remove ${item.product.name} from cart`}
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
                            aria-label={`Decrease quantity of ${item.product.name}`}
                            className="px-2 py-1 transition-colors duration-300 ease-fluid hover:bg-neutral-700"
                            onClick={() => handleUpdateQuantity(-1)}
                            disabled={isUpdating}
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="flex justify-center w-[40px] px-3 text-sm font-bold">
                            {localQuantity}
                        </span>
                        <button
                            type="button"
                            aria-label={`Increase quantity of ${item.product.name}`}
                            className="px-2 py-1 transition-colors duration-300 ease-fluid hover:bg-neutral-700"
                            onClick={() => handleUpdateQuantity(1)}
                            disabled={isUpdating}
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
                                parseFloat(item.priceAtAdd) * localQuantity,
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
