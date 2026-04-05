"use client";

import { useRef, useEffect, useMemo } from "react";
import { useCartStore } from "@/stores/cart-store";
import type { Cart } from "@/types/cart";

interface CartProviderProps {
    initialCart: Cart | null;
    children: React.ReactNode;
}

export function CartProvider({ initialCart, children }: CartProviderProps) {
    const initialize = useCartStore((state) => state.initialize);
    const initialized = useRef(false);

    useMemo(() => {
        useCartStore.setState({
            cart: initialCart,
            isInitialized: true,
        });
    }, []);

    // Update if initialCart changes (e.g., after revalidation)
    useEffect(() => {
        initialize(initialCart);
    }, [initialCart, initialize]);

    return <>{children}</>;
}
