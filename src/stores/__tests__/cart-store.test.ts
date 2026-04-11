import { beforeEach, describe, expect, it } from "vitest";
import { selectItemCount, selectTotalPrice, useCartStore } from "../cart-store";
import type { Cart, CartItem } from "@/types/cart";

const mockProduct = {
    id: "prod-1",
    name: "Test Product",
    description: null,
    price: "29.99",
    stockQuantity: 10,
    imageUrl: null,
    categoryId: "cat-1",
    category: {
        id: "cat-1",
        name: "Test",
        description: null,
        parentId: null,
    },
    createdAt: "2024-01-01",
};

const mockCartItem: CartItem = {
    id: "item-1",
    productId: "prod-1",
    quantity: 2,
    priceAtAdd: "29.99",
    product: mockProduct,
};

const mockCart: Cart = {
    id: "cart-1",
    userId: "user-1",
    items: [mockCartItem],
};

describe("cart store", () => {
    beforeEach(() => {
        useCartStore.setState({ cart: null, isInitialized: false });
    });

    it("initializes with cart data", () => {
        useCartStore.getState().initialize(mockCart);

        expect(useCartStore.getState().cart).toEqual(mockCart);
        expect(useCartStore.getState().isInitialized).toBe(true);
    });

    it("initializes with null cart", () => {
        useCartStore.getState().initialize(null);

        expect(useCartStore.getState().cart).toBeNull();
        expect(useCartStore.getState().isInitialized).toBe(true);
    });

    it("sets cart directly", () => {
        useCartStore.getState().setCart(mockCart);

        expect(useCartStore.getState().cart).toEqual(mockCart);
        expect(useCartStore.getState().isInitialized).toBe(false);
    });

    it("computes item count correctly", () => {
        useCartStore.setState({ cart: mockCart });

        expect(selectItemCount(useCartStore.getState())).toBe(2);
    });

    it("computes total price correctly", () => {
        useCartStore.setState({ cart: mockCart });

        expect(selectTotalPrice(useCartStore.getState())).toBeCloseTo(59.98);
    });

    it("returns 0 for null cart", () => {
        expect(selectItemCount(useCartStore.getState())).toBe(0);
        expect(selectTotalPrice(useCartStore.getState())).toBe(0);
    });

    it("returns 0 for an empty cart", () => {
        useCartStore.setState({
            cart: {
                ...mockCart,
                items: [],
            },
        });

        expect(selectItemCount(useCartStore.getState())).toBe(0);
        expect(selectTotalPrice(useCartStore.getState())).toBe(0);
    });
});
