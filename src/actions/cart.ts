"use server";

import { updateTag } from "next/cache";
import { apiAuthPost, apiAuthPatch, apiAuthDelete } from "@/lib/api-auth";
import { ApiClientError } from "@/lib/api";
import {
    ACTION_RESULT_CODES,
    type ActionResultCode,
} from "@/lib/constants/action-result-codes";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { ERRORS } from "@/lib/constants/errors";
import { API_ROUTES } from "@/lib/constants/routes";
import type { Cart } from "@/types/cart";

export interface CartActionResult {
    success: boolean;
    message?: string;
    cart?: Cart;
    code?: ActionResultCode;
}

export async function addToCartAction(
    productId: string,
    quantity: number = 1,
): Promise<CartActionResult> {
    try {
        const cart = await apiAuthPost<Cart>(
            API_ROUTES.CART.ROOT,
            { productId, quantity },
            { redirectOn401: false },
        );
        updateTag(CACHE_TAGS.CART);
        return { success: true, cart };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message: error.message,
                code:
                    error.statusCode === 401
                        ? ACTION_RESULT_CODES.UNAUTHORIZED
                        : ACTION_RESULT_CODES.API_ERROR,
            };
        }
        return {
            success: false,
            message: ERRORS.CART.ADD_FAILED,
            code: ACTION_RESULT_CODES.UNKNOWN,
        };
    }
}

export async function adjustCartItemAction(
    productId: string,
    quantity: number,
): Promise<CartActionResult> {
    try {
        const cart = await apiAuthPatch<Cart>(
            API_ROUTES.CART.ITEM(productId),
            {
                quantity,
            },
            { redirectOn401: false },
        );
        updateTag(CACHE_TAGS.CART);
        return { success: true, cart };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message: error.message,
                code:
                    error.statusCode === 401
                        ? ACTION_RESULT_CODES.UNAUTHORIZED
                        : ACTION_RESULT_CODES.API_ERROR,
            };
        }
        return {
            success: false,
            message: ERRORS.CART.UPDATE_FAILED,
            code: ACTION_RESULT_CODES.UNKNOWN,
        };
    }
}

export async function removeCartItemAction(
    productId: string,
): Promise<CartActionResult> {
    try {
        const cart = await apiAuthDelete<Cart>(
            API_ROUTES.CART.ITEM(productId),
            { redirectOn401: false },
        );
        updateTag(CACHE_TAGS.CART);
        return { success: true, cart };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message: error.message,
                code:
                    error.statusCode === 401
                        ? ACTION_RESULT_CODES.UNAUTHORIZED
                        : ACTION_RESULT_CODES.API_ERROR,
            };
        }
        return {
            success: false,
            message: ERRORS.CART.REMOVE_FAILED,
            code: ACTION_RESULT_CODES.UNKNOWN,
        };
    }
}
