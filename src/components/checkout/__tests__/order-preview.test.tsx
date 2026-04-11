import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OrderPreview } from "../order-preview";

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

const items = [
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
            imageUrl: "https://example.com/image.jpg",
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
];

describe("OrderPreview", () => {
    it("renders linked product image/name and totals", () => {
        render(<OrderPreview items={items} />);

        const links = screen.getAllByRole("link");

        expect(links).toHaveLength(2);
        expect(links[0]).toHaveAttribute("href", "/products/prod-1");
        expect(links[1]).toHaveAttribute("href", "/products/prod-1");
        expect(screen.getByText("Qty: 2")).toBeInTheDocument();
        expect(screen.getAllByText("$59.98")).toHaveLength(3);
        expect(screen.getByText("FREE")).toBeInTheDocument();
    });
});
