"use server";

import { updateTag } from "next/cache";
import { apiAuthPost, apiAuthPatch, apiAuthDelete } from "@/lib/api-auth";
import { ApiClientError } from "@/lib/api";
import { ERRORS } from "@/lib/constants/errors";
import { API_ROUTES } from "@/lib/constants/routes";
import type { Cart } from "@/types/cart";

export interface CartActionResult {
    success: boolean;
    message?: string;
    cart?: Cart;
    code?: "UNAUTHORIZED" | "API_ERROR" | "UNKNOWN";
}

export async function addToCartAction(
    productId: string,
    quantity: number = 1,
): Promise<CartActionResult> {
    try {
        const cart = await apiAuthPost<Cart>(
            API_ROUTES.CART,
            { productId, quantity },
            { redirectOn401: false },
        );
        updateTag("cart");
        return { success: true, cart };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message: error.message,
                code:
                    error.statusCode === 401 ? "UNAUTHORIZED" : "API_ERROR",
            };
        }
        return {
            success: false,
            message: ERRORS.CART.ADD_FAILED,
            code: "UNKNOWN",
        };
    }
}

export async function adjustCartItemAction(
    productId: string,
    quantity: number,
): Promise<CartActionResult> {
    try {
        const cart = await apiAuthPatch<Cart>(
            `${API_ROUTES.CART}/${productId}`,
            {
                quantity,
            },
            { redirectOn401: false },
        );
        updateTag("cart");
        return { success: true, cart };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message: error.message,
                code:
                    error.statusCode === 401 ? "UNAUTHORIZED" : "API_ERROR",
            };
        }
        return {
            success: false,
            message: ERRORS.CART.UPDATE_FAILED,
            code: "UNKNOWN",
        };
    }
}

export async function removeCartItemAction(
    productId: string,
): Promise<CartActionResult> {
    try {
        const cart = await apiAuthDelete<Cart>(
            `${API_ROUTES.CART}/${productId}`,
            { redirectOn401: false },
        );
        updateTag("cart");
        return { success: true, cart };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message: error.message,
                code:
                    error.statusCode === 401 ? "UNAUTHORIZED" : "API_ERROR",
            };
        }
        return {
            success: false,
            message: ERRORS.CART.REMOVE_FAILED,
            code: "UNKNOWN",
        };
    }
}
