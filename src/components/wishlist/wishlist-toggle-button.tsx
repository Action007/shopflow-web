"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Heart, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import {
    addToWishlistAction,
    removeFromWishlistAction,
} from "@/actions/wishlist";
import { ACTION_RESULT_CODES } from "@/lib/constants/action-result-codes";
import { ROUTES } from "@/lib/constants/routes";
import { ERRORS } from "@/lib/constants/errors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistToggleButtonProps {
    productId: string;
    initialIsWishlisted?: boolean;
    className?: string;
}

export function WishlistToggleButton({
    productId,
    initialIsWishlisted = false,
    className,
}: WishlistToggleButtonProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
    const [isPending, setIsPending] = useState(false);

    const handleToggle = async () => {
        setIsPending(true);

        const result = isWishlisted
            ? await removeFromWishlistAction(productId)
            : await addToWishlistAction(productId);

        setIsPending(false);

        if (!result.success) {
            if (result.code === ACTION_RESULT_CODES.UNAUTHORIZED) {
                const currentPath = searchParams.toString()
                    ? `${pathname}?${searchParams.toString()}`
                    : pathname;

                toast.error(ERRORS.AUTH.LOGIN_REQUIRED, {
                    description:
                        "Please sign in to save products to your wishlist.",
                });
                router.push(
                    `${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(currentPath)}`,
                );
                return;
            }

            toast.error(
                isWishlisted
                    ? ERRORS.WISHLIST.REMOVE_FAILED
                    : ERRORS.WISHLIST.ADD_FAILED,
                {
                    description: result.message ?? ERRORS.GENERIC.TRY_AGAIN,
                },
            );
            return;
        }

        const nextValue = !isWishlisted;
        setIsWishlisted(nextValue);
        toast.success(
            nextValue ? ERRORS.WISHLIST.ADDED : ERRORS.WISHLIST.REMOVED,
        );
        router.refresh();
    };

    return (
        <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            className={cn(
                "w-full justify-center gap-2 py-4 text-xs uppercase tracking-widest",
                className,
            )}
            onClick={handleToggle}
        >
            {isPending ? (
                <>
                    <LoaderCircle className="h-[18px] w-[18px] animate-spin" />
                    Updating...
                </>
            ) : isWishlisted ? (
                <>
                    <Check className="h-[18px] w-[18px]" />
                    Wishlisted
                </>
            ) : (
                <>
                    <Heart className="h-[18px] w-[18px]" />
                    Wishlist
                </>
            )}
        </Button>
    );
}
