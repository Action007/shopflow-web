import { beforeEach, describe, expect, it, vi } from "vitest";
import { ACTION_RESULT_CODES } from "@/lib/constants/action-result-codes";
import { ERRORS } from "@/lib/constants/errors";

const { apiAuthPostMock, apiAuthPatchMock, apiAuthDeleteMock } = vi.hoisted(
    () => ({
        apiAuthPostMock: vi.fn(),
        apiAuthPatchMock: vi.fn(),
        apiAuthDeleteMock: vi.fn(),
    }),
);

const { updateTagMock } = vi.hoisted(() => ({
    updateTagMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
    updateTag: updateTagMock,
}));

vi.mock("@/lib/api-auth", () => ({
    apiAuthPost: apiAuthPostMock,
    apiAuthPatch: apiAuthPatchMock,
    apiAuthDelete: apiAuthDeleteMock,
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
import {
    addToCartAction,
    adjustCartItemAction,
    removeCartItemAction,
} from "../cart";

const mockCart = {
    id: "cart-1",
    userId: "user-1",
    items: [],
};

describe("cart actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("adds to cart and updates the cart tag on success", async () => {
        apiAuthPostMock.mockResolvedValueOnce(mockCart);

        const result = await addToCartAction("prod-1", 2);

        expect(apiAuthPostMock).toHaveBeenCalledWith(
            "/cart",
            { productId: "prod-1", quantity: 2 },
            { redirectOn401: false },
        );
        expect(updateTagMock).toHaveBeenCalledWith("cart");
        expect(result).toEqual({ success: true, cart: mockCart });
    });

    it("returns unauthorized code when addToCart gets a 401", async () => {
        apiAuthPostMock.mockRejectedValueOnce(
            new ApiClientError("Unauthorized", 401),
        );

        const result = await addToCartAction("prod-1");

        expect(result).toEqual({
            success: false,
            message: "Unauthorized",
            code: ACTION_RESULT_CODES.UNAUTHORIZED,
        });
    });

    it("adjusts quantity and updates the cart tag on success", async () => {
        apiAuthPatchMock.mockResolvedValueOnce(mockCart);

        const result = await adjustCartItemAction("prod-1", 3);

        expect(apiAuthPatchMock).toHaveBeenCalledWith(
            "/cart/prod-1",
            { quantity: 3 },
            { redirectOn401: false },
        );
        expect(updateTagMock).toHaveBeenCalledWith("cart");
        expect(result).toEqual({ success: true, cart: mockCart });
    });

    it("returns api error code for non-401 adjust failures", async () => {
        apiAuthPatchMock.mockRejectedValueOnce(
            new ApiClientError("No stock", 400),
        );

        const result = await adjustCartItemAction("prod-1", 99);

        expect(result).toEqual({
            success: false,
            message: "No stock",
            code: ACTION_RESULT_CODES.API_ERROR,
        });
    });

    it("removes item and updates the cart tag on success", async () => {
        apiAuthDeleteMock.mockResolvedValueOnce(mockCart);

        const result = await removeCartItemAction("prod-1");

        expect(apiAuthDeleteMock).toHaveBeenCalledWith("/cart/prod-1", {
            redirectOn401: false,
        });
        expect(updateTagMock).toHaveBeenCalledWith("cart");
        expect(result).toEqual({ success: true, cart: mockCart });
    });

    it("returns fallback remove error for unknown failures", async () => {
        apiAuthDeleteMock.mockRejectedValueOnce(new Error("boom"));

        const result = await removeCartItemAction("prod-1");

        expect(result).toEqual({
            success: false,
            message: ERRORS.CART.REMOVE_FAILED,
            code: ACTION_RESULT_CODES.UNKNOWN,
        });
    });
});
