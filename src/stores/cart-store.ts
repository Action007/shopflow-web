import { create } from "zustand";
import type { Cart } from "@/types/cart";

interface CartState {
    cart: Cart | null;
    isInitialized: boolean;
}

interface CartActions {
    setCart: (cart: Cart | null) => void;
    initialize: (cart: Cart | null) => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>((set) => ({
    cart: null,
    isInitialized: false,

    initialize: (cart) => set({ cart, isInitialized: true }),

    setCart: (cart) => set({ cart }),
}));

// Derived selectors — use these in components instead of computing inline
// These are created outside the store so they only recompute when cart changes
export const selectItemCount = (state: CartStore) =>
    state.cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

export const selectTotalPrice = (state: CartStore) =>
    state.cart?.items.reduce(
        (sum, item) => sum + parseFloat(item.priceAtAdd) * item.quantity,
        0,
    ) ?? 0;
