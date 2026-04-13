/* eslint-disable @next/next/no-img-element */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "../product-card";
import type { Product } from "@/types/product";

vi.mock("next/image", () => ({
    default: ({
        alt = "",
        ...props
    }: {
        alt?: string;
        [key: string]: unknown;
    }) => <img alt={alt} {...props} />,
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

vi.mock("@/components/cart/add-to-cart-button", () => ({
    AddToCartButton: ({
        productId,
        disabled,
    }: {
        productId: string;
        disabled?: boolean;
    }) => (
        <button data-product-id={productId} disabled={disabled}>
            Add to cart
        </button>
    ),
}));

vi.mock("@/components/wishlist/wishlist-toggle-button", () => ({
    WishlistToggleButton: ({
        productId,
    }: {
        productId: string;
    }) => <button data-product-id={productId}>Wishlist</button>,
}));

const baseProduct: Product = {
    id: "prod-1",
    name: "Test Laptop",
    description: "A great laptop",
    price: "999.99",
    stockQuantity: 5,
    imageUrl: "https://example.com/img.jpg",
    categoryId: "cat-1",
    category: {
        id: "cat-1",
        name: "Electronics",
        description: null,
        parentId: null,
    },
    createdAt: "2024-01-01",
};

describe("ProductCard", () => {
    it("renders product name and price", () => {
        render(<ProductCard product={baseProduct} />);

        expect(screen.getByText("Test Laptop")).toBeInTheDocument();
        expect(screen.getByText("$999.99")).toBeInTheDocument();
    });

    it("renders category name", () => {
        render(<ProductCard product={baseProduct} />);

        expect(screen.getAllByText("Electronics")).toHaveLength(2);
    });

    it("links to product detail page from the image and title", () => {
        render(<ProductCard product={baseProduct} />);

        const links = screen.getAllByRole("link");

        expect(links).toHaveLength(2);
        expect(links[0]).toHaveAttribute("href", "/products/prod-1");
        expect(links[1]).toHaveAttribute("href", "/products/prod-1");
    });

    it("shows in stock badge when stockQuantity is above 0", () => {
        render(<ProductCard product={baseProduct} />);

        expect(screen.getAllByText("In Stock")).toHaveLength(2);
        expect(screen.queryByText("Out of Stock")).not.toBeInTheDocument();
    });

    it("shows out of stock badge and disables add to cart when stockQuantity is 0", () => {
        render(<ProductCard product={{ ...baseProduct, stockQuantity: 0 }} />);

        expect(screen.getAllByText("Out of Stock")).toHaveLength(2);
        expect(
            screen.getByRole("button", { name: "Add to cart" }),
        ).toBeDisabled();
    });

    it("shows placeholder when no image", () => {
        render(<ProductCard product={{ ...baseProduct, imageUrl: null }} />);

        expect(screen.getByText("No image")).toBeInTheDocument();
    });
});
