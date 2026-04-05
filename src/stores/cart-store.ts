import { create } from "zustand";
import type { Cart, CartItem } from "@/types/cart";

interface CartState {
    cart: Cart | null;
    isInitialized: boolean;
}

interface CartActions {
    setCart: (cart: Cart | null) => void;
    initialize: (cart: Cart | null) => void;
    optimisticAdd: (item: CartItem) => void;
    optimisticUpdateQuantity: (productId: string, quantity: number) => void;
    optimisticRemove: (productId: string) => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>((set) => ({
    cart: null,
    isInitialized: false,

    initialize: (cart) => set({ cart, isInitialized: true }),

    setCart: (cart) => set({ cart }),

    optimisticAdd: (item) =>
        set((state) => {
            if (!state.cart) {
                return {
                    cart: { items: [item] } as Cart,
                    isInitialized: true,
                };
            }
            const existing = state.cart.items.find(
                (i) => i.productId === item.productId,
            );
            if (existing) {
                return {
                    cart: {
                        ...state.cart,
                        items: state.cart.items.map((i) =>
                            i.productId === item.productId
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i,
                        ),
                    },
                };
            }
            return {
                cart: { ...state.cart, items: [...state.cart.items, item] },
            };
        }),

    optimisticUpdateQuantity: (productId, quantity) =>
        set((state) => {
            if (!state.cart) return state;
            return {
                cart: {
                    ...state.cart,
                    items: state.cart.items.map((i) =>
                        i.productId === productId ? { ...i, quantity } : i,
                    ),
                },
            };
        }),

    optimisticRemove: (productId) =>
        set((state) => {
            if (!state.cart) return state;
            return {
                cart: {
                    ...state.cart,
                    items: state.cart.items.filter(
                        (i) => i.productId !== productId,
                    ),
                },
            };
        }),
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
