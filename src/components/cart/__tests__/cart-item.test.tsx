/* eslint-disable @next/next/no-img-element */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCartStore } from "@/stores/cart-store";

const { adjustCartItemActionMock, removeCartItemActionMock, toastErrorMock } =
    vi.hoisted(() => ({
        adjustCartItemActionMock: vi.fn(),
        removeCartItemActionMock: vi.fn(),
        toastErrorMock: vi.fn(),
    }));

vi.mock("next/image", () => ({
    default: ({
        alt = "",
        fill,
        ...props
    }: {
        alt?: string;
        fill?: boolean;
        [key: string]: unknown;
    }) => {
        void fill;
        return <img alt={alt} {...props} />;
    },
}));

vi.mock("next/link", () => ({
    default: ({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) => <a href={href}>{children}</a>,
}));

vi.mock("@/actions/cart", () => ({
    adjustCartItemAction: adjustCartItemActionMock,
    removeCartItemAction: removeCartItemActionMock,
}));

vi.mock("@/hooks/use-debounced-callback", () => ({
    useDebouncedCallback: (fn: (...args: unknown[]) => void) => fn,
}));

vi.mock("sonner", () => ({
    toast: {
        error: toastErrorMock,
    },
}));

import { CartItem } from "../cart-item";

const product = {
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
};

const item = {
    id: "item-1",
    productId: "prod-1",
    quantity: 2,
    priceAtAdd: "29.99",
    product,
};

describe("CartItem", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useCartStore.setState({ cart: null, isInitialized: false });
    });

    it("increments quantity and syncs cart on successful update", async () => {
        adjustCartItemActionMock.mockResolvedValueOnce({
            success: true,
            cart: {
                id: "cart-1",
                userId: "user-1",
                items: [{ ...item, quantity: 3 }],
            },
        });

        render(<CartItem item={item} />);

        fireEvent.click(
            screen.getByRole("button", {
                name: /increase quantity of test product/i,
            }),
        );

        await waitFor(() => {
            expect(adjustCartItemActionMock).toHaveBeenCalledWith("prod-1", 3);
        });

        expect(screen.getByText("$89.97")).toBeInTheDocument();
    });

    it("removes item when quantity would drop below 1", async () => {
        removeCartItemActionMock.mockResolvedValueOnce({
            success: true,
            cart: {
                id: "cart-1",
                userId: "user-1",
                items: [],
            },
        });

        render(<CartItem item={{ ...item, quantity: 1 }} />);

        fireEvent.click(
            screen.getByRole("button", {
                name: /decrease quantity of test product/i,
            }),
        );

        await waitFor(() => {
            expect(removeCartItemActionMock).toHaveBeenCalledWith("prod-1");
        });
    });

    it("shows toast when quantity update fails", async () => {
        adjustCartItemActionMock.mockResolvedValueOnce({
            success: false,
            message: "No stock",
        });

        render(<CartItem item={item} />);

        fireEvent.click(
            screen.getByRole("button", {
                name: /increase quantity of test product/i,
            }),
        );

        await waitFor(() => {
            expect(toastErrorMock).toHaveBeenCalled();
        });
    });
});
