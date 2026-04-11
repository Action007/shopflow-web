import { beforeEach, describe, expect, it, vi } from "vitest";
import { ERRORS } from "@/lib/constants/errors";

const { apiAuthPostMock } = vi.hoisted(() => ({
    apiAuthPostMock: vi.fn(),
}));

const { redirectMock } = vi.hoisted(() => ({
    redirectMock: vi.fn(),
}));

const { revalidatePathMock, revalidateTagMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    revalidateTagMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    redirect: redirectMock,
}));

vi.mock("next/cache", () => ({
    revalidatePath: revalidatePathMock,
    revalidateTag: revalidateTagMock,
}));

vi.mock("@/lib/api-auth", () => ({
    apiAuthPost: apiAuthPostMock,
}));

vi.mock("@/lib/api", async () => {
    class MockApiClientError extends Error {
        constructor(message: string, public statusCode: number) {
            super(message);
            this.name = "ApiClientError";
        }
    }

    return {
        ApiClientError: MockApiClientError,
    };
});

import { ApiClientError } from "@/lib/api";
import { cancelOrderAction, placeOrderAction } from "../order";

const mockOrder = {
    id: "order-1",
    orderNumber: "1001",
    status: "PENDING" as const,
    totalAmount: "59.98",
    shippingAddress: "123 Main St, Neo Tokyo, CA 12345",
    createdAt: "2024-01-01",
    items: [
        {
            id: "item-1",
            productId: "prod-1",
            quantity: 2,
            priceAtPurchase: "29.99",
            productNameAtPurchase: "Test Product",
        },
    ],
};

describe("order actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns validation errors for invalid checkout input", async () => {
        const result = await placeOrderAction({
            shippingAddress: "123",
            city: "",
            state: "",
            zipCode: "12",
            phone: "123",
        });

        expect(result.success).toBe(false);
        expect(result.fieldErrors?.shippingAddress?.[0]).toBeTruthy();
        expect(result.fieldErrors?.city?.[0]).toBeTruthy();
        expect(result.fieldErrors?.state?.[0]).toBeTruthy();
        expect(result.fieldErrors?.zipCode?.[0]).toBeTruthy();
        expect(result.fieldErrors?.phone?.[0]).toBeTruthy();
        expect(apiAuthPostMock).not.toHaveBeenCalled();
    });

    it("places an order, revalidates caches, and redirects on success", async () => {
        apiAuthPostMock.mockResolvedValueOnce(mockOrder);

        await placeOrderAction({
            shippingAddress: "123 Main St",
            city: "Neo Tokyo",
            state: "CA",
            zipCode: "12345",
            phone: "1234567890",
        });

        expect(apiAuthPostMock).toHaveBeenCalledWith("/orders", {
            shippingAddress: "123 Main St, Neo Tokyo, CA 12345",
        });
        expect(revalidateTagMock).toHaveBeenCalledWith("orders", "max");
        expect(revalidateTagMock).toHaveBeenCalledWith("cart", "max");
        expect(revalidateTagMock).toHaveBeenCalledWith("products", "max");
        expect(revalidateTagMock).toHaveBeenCalledWith("product-prod-1", "max");
        expect(revalidatePathMock).toHaveBeenCalledWith("/products");
        expect(revalidatePathMock).toHaveBeenCalledWith("/products/prod-1");
        expect(redirectMock).toHaveBeenCalledWith("/orders/order-1");
    });

    it("returns api error message when place order fails", async () => {
        apiAuthPostMock.mockRejectedValueOnce(
            new ApiClientError("Cart is empty", 400),
        );

        const result = await placeOrderAction({
            shippingAddress: "123 Main St",
            city: "Neo Tokyo",
            state: "CA",
            zipCode: "12345",
            phone: "1234567890",
        });

        expect(result).toEqual({
            success: false,
            message: "Cart is empty",
        });
    });

    it("cancels order and revalidates caches on success", async () => {
        apiAuthPostMock.mockResolvedValueOnce(mockOrder);

        const result = await cancelOrderAction("order-1");

        expect(apiAuthPostMock).toHaveBeenCalledWith("/orders/order-1/cancel");
        expect(revalidateTagMock).toHaveBeenCalledWith("orders", "max");
        expect(revalidateTagMock).toHaveBeenCalledWith("cart", "max");
        expect(result).toEqual({
            success: true,
            order: mockOrder,
        });
    });

    it("returns fallback message when cancel order fails unexpectedly", async () => {
        apiAuthPostMock.mockRejectedValueOnce(new Error("boom"));

        const result = await cancelOrderAction("order-1");

        expect(result).toEqual({
            success: false,
            message: ERRORS.ORDER.CANCEL_FAILED,
        });
    });
});
