"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
        <Card className="flex gap-4 p-4">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                {item.product.imageUrl ? (
                    <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        No image
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <Link
                        href={`/products/${item.productId}`}
                        className="font-medium hover:underline"
                    >
                        {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {formatPrice(item.priceAtAdd)} each
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                                handleUpdateQuantity(item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                                handleUpdateQuantity(item.quantity + 1)
                            }
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="font-medium">
                            {formatPrice(
                                parseFloat(item.priceAtAdd) * item.quantity,
                            )}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleRemove}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
