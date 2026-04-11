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

vi.mock("../cart-item", () => ({
    CartItem: ({ item }: { item: { product: { name: string } } }) => (
        <div>{item.product.name}</div>
    ),
}));

vi.mock("../cart-summary", () => ({
    CartSummary: () => <div>Summary</div>,
}));

vi.mock("../cart-content-skeleton", () => ({
    CartContentSkeleton: () => <div>Loading cart...</div>,
}));

import { CartContent } from "../cart-content";

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
                name: "Keyboard",
                description: null,
                price: "29.99",
                stockQuantity: 10,
                imageUrl: null,
                categoryId: "cat-1",
                category: {
                    id: "cat-1",
                    name: "Accessories",
                    description: null,
                    parentId: null,
                },
                createdAt: "2024-01-01",
            },
        },
    ],
};

describe("CartContent", () => {
    beforeEach(() => {
        useCartStore.setState({ cart: null, isInitialized: false });
    });

    it("renders loading skeleton before cart initializes", () => {
        render(<CartContent />);

        expect(screen.getByText("Loading cart...")).toBeInTheDocument();
    });

    it("renders empty state for initialized empty cart", () => {
        useCartStore.setState({ cart: null, isInitialized: true });

        render(<CartContent />);

        expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Browse Products" })).toHaveAttribute(
            "href",
            "/products",
        );
    });

    it("renders cart items and summary for populated cart", () => {
        useCartStore.setState({ cart: mockCart, isInitialized: true });

        render(<CartContent />);

        expect(screen.getByText("Your Cart")).toBeInTheDocument();
        expect(screen.getByText("Keyboard")).toBeInTheDocument();
        expect(screen.getByText("Summary")).toBeInTheDocument();
    });
});
