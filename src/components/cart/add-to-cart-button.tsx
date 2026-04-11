"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/actions/cart";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { ACTION_RESULT_CODES } from "@/lib/constants/action-result-codes";
import { ERRORS } from "@/lib/constants/errors";
import { APP_CONFIG } from "@/lib/constants/app-config";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
    productId: string;
    quantity?: number;
    disabled?: boolean;
    className?: string;
    variant?: "default" | "card";
    onAdded?: () => void;
}

export function AddToCartButton({
    productId,
    quantity = 1,
    disabled,
    className,
    variant = "default",
    onAdded,
}: AddToCartButtonProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isAdding, setIsAdding] = useState(false);
    const [justAdded, setJustAdded] = useState(false);
    const setCart = useCartStore((state) => state.setCart);

    const handleAdd = async () => {
        setIsAdding(true);

        const result = await addToCartAction(productId, quantity);
        setIsAdding(false);

        if (result.success && result.cart) {
            setCart(result.cart);
            setJustAdded(true);
            onAdded?.();
            setTimeout(() => setJustAdded(false), APP_CONFIG.CART.OPTIMISTIC_FEEDBACK_DURATION_MS);
        } else {
            if (result.code === ACTION_RESULT_CODES.UNAUTHORIZED) {
                const currentPath = searchParams.toString()
                    ? `${pathname}?${searchParams.toString()}`
                    : pathname;

                toast.error(ERRORS.AUTH.LOGIN_REQUIRED, {
                    description: ERRORS.CART.LOGIN_REQUIRED_DESCRIPTION,
                });
                router.push(
                    `${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(currentPath)}`,
                );
                return;
            }

            toast.error(ERRORS.CART.ADD_FAILED, {
                description: result.message || ERRORS.GENERIC.TRY_AGAIN,
            });
        }
    };

    return (
        <Button
            onClick={handleAdd}
            disabled={disabled || isAdding || justAdded}
            size="lg"
            className={cn("w-full", className)}
            variant={justAdded ? "secondary" : variant}
        >
            {justAdded ? (
                <>
                    <Check className="mr-2 h-5 w-5" />
                    Added!
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to cart
                </>
            )}
        </Button>
    );
}
