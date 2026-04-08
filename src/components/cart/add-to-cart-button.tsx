"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/actions/cart";
import { useCartStore } from "@/stores/cart-store";
import { CartItem } from "@/types/cart";
import { toast } from "sonner";
import { ERRORS } from "@/lib/constants/errors";
import { APP_CONFIG } from "@/lib/constants/app-config";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
    productId: string;
    disabled?: boolean;
    className?: string;
}

export function AddToCartButton({
    productId,
    disabled,
    className,
}: AddToCartButtonProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [justAdded, setJustAdded] = useState(false);
    const { setCart, optimisticAdd, optimisticRemove } = useCartStore();

    const handleAdd = async () => {
        setIsAdding(true);

        // Optimistic update — badge reflects the add immediately
        const optimisticItem = {
            productId,
            quantity: 1,
            priceAtAdd: "0",
            product: { name: "", imageUrl: null },
        } as CartItem;
        optimisticAdd(optimisticItem);

        const result = await addToCartAction(productId, 1);
        setIsAdding(false);

        if (result.success && result.cart) {
            setCart(result.cart); // reconcile with real data
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), APP_CONFIG.CART.OPTIMISTIC_FEEDBACK_DURATION_MS);
        } else {
            // rollback
            optimisticRemove(productId);
            toast.error(ERRORS.CART.ADD_FAILED, {
                description: result.message || ERRORS.GENERIC.TRY_AGAIN,
            });
        }
    };

    return (
        <Button
            onClick={handleAdd}
            disabled={disabled || isAdding}
            size="lg"
            className={cn("w-full md:w-auto", className)}
            variant={justAdded ? "secondary" : "default"}
        >
            {justAdded ? (
                <>
                    <Check className="mr-2 h-5 w-5" />
                    Added!
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isAdding ? "Adding..." : "Add to cart"}
                </>
            )}
        </Button>
    );
}
