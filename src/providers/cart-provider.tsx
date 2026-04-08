"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import type { Cart } from "@/types/cart";

interface CartProviderProps {
    initialCart: Cart | null;
    children: React.ReactNode;
}

export function CartProvider({ initialCart, children }: CartProviderProps) {
    const initialize = useCartStore((state) => state.initialize);

    // Update if initialCart changes (e.g., after revalidation)
    useEffect(() => {
        initialize(initialCart);
    }, [initialCart, initialize]);

    return <>{children}</>;
}
