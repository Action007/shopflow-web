import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductGrid } from "../product-grid";
import type { Product } from "@/types/product";

vi.mock("../product-card", () => ({
    ProductCard: ({
        product,
        imagePriority,
        isWishlisted,
        showPurchaseActions,
    }: {
        product: Product;
        imagePriority?: boolean;
        isWishlisted?: boolean;
        showPurchaseActions?: boolean;
    }) => (
        <div
            data-testid="product-card"
            data-product-id={product.id}
            data-priority={imagePriority ? "true" : "false"}
            data-wishlisted={isWishlisted ? "true" : "false"}
            data-actions={showPurchaseActions ? "true" : "false"}
        >
            {product.name}
        </div>
    ),
}));

const products: Product[] = [
    {
        id: "prod-1",
        name: "Alpha",
        description: "Alpha product",
        price: "100.00",
        stockQuantity: 5,
        imageUrl: "https://example.com/alpha.jpg",
        categoryId: "cat-1",
        category: {
            id: "cat-1",
            name: "Electronics",
            description: null,
            parentId: null,
        },
        createdAt: "2024-01-01",
    },
    {
        id: "prod-2",
        name: "Beta",
        description: "Beta product",
        price: "200.00",
        stockQuantity: 2,
        imageUrl: "https://example.com/beta.jpg",
        categoryId: "cat-1",
        category: {
            id: "cat-1",
            name: "Electronics",
            description: null,
            parentId: null,
        },
        createdAt: "2024-01-02",
    },
];

describe("ProductGrid", () => {
    it("renders one card per product", () => {
        render(<ProductGrid products={products} />);

        expect(screen.getAllByTestId("product-card")).toHaveLength(2);
        expect(screen.getByText("Alpha")).toBeInTheDocument();
        expect(screen.getByText("Beta")).toBeInTheDocument();
    });

    it("marks only the first product image as priority", () => {
        render(<ProductGrid products={products} />);

        const cards = screen.getAllByTestId("product-card");

        expect(cards[0]).toHaveAttribute("data-priority", "true");
        expect(cards[1]).toHaveAttribute("data-priority", "false");
    });

    it("passes wishlist and purchase action state through to cards", () => {
        render(
            <ProductGrid
                products={products}
                wishlistProductIds={["prod-2"]}
                showPurchaseActions={false}
            />,
        );

        const cards = screen.getAllByTestId("product-card");

        expect(cards[0]).toHaveAttribute("data-wishlisted", "false");
        expect(cards[1]).toHaveAttribute("data-wishlisted", "true");
        expect(cards[0]).toHaveAttribute("data-actions", "false");
        expect(cards[1]).toHaveAttribute("data-actions", "false");
    });
});
