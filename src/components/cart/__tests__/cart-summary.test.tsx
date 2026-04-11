import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCartStore } from "@/stores/cart-store";

vi.mock("next/link", () => ({
    default: ({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) => <a href={href}>{children}</a>,
}));

import { CartSummary } from "../cart-summary";

const mockCart = {
    id: "cart-1",
    userId: "user-1",
    items: [
        {
            id: "item-1",
            productId: "prod-1",
            quantity: 2,
            priceAtAdd: "29.99",
            product: {
                id: "prod-1",
                name: "Test Product",
                description: null,
                price: "29.99",
                stockQuantity: 10,
                imageUrl: null,
                categoryId: "cat-1",
                category: {
                    id: "cat-1",
                    name: "Category",
                    description: null,
                    parentId: null,
                },
                createdAt: "2024-01-01",
            },
        },
    ],
};

describe("CartSummary", () => {
    beforeEach(() => {
        useCartStore.setState({ cart: null, isInitialized: false });
    });

    it("shows disabled checkout button for empty cart", () => {
        render(<CartSummary />);

        expect(
            screen.getByRole("button", { name: "Proceed to Checkout" }),
        ).toBeDisabled();
    });

    it("shows computed total and checkout link for cart with items", () => {
        useCartStore.setState({ cart: mockCart, isInitialized: true });

        render(<CartSummary />);

        expect(screen.getAllByText("$59.98")).toHaveLength(2);
        expect(
            screen.getByRole("link", { name: /Proceed to Checkout/i }),
        ).toHaveAttribute("href", "/checkout");
    });
});
