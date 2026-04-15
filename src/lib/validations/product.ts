import * as v from "valibot";
import { ERRORS } from "@/lib/constants/errors";

const pricePattern = /^\d+(\.\d{1,2})?$/;

export const createProductSchema = v.object({
    name: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, ERRORS.VALIDATION.PRODUCT.NAME_REQUIRED),
    ),
    description: v.optional(v.string()),
    imageUploadId: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, ERRORS.VALIDATION.PRODUCT.IMAGE_REQUIRED),
    ),
    price: v.pipe(
        v.string(),
        v.regex(pricePattern, ERRORS.VALIDATION.PRODUCT.PRICE_INVALID),
    ),
    stockQuantity: v.pipe(
        v.number(),
        v.integer(ERRORS.VALIDATION.PRODUCT.STOCK_INTEGER),
        v.minValue(0, ERRORS.VALIDATION.PRODUCT.STOCK_NON_NEGATIVE),
    ),
    categoryId: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, ERRORS.VALIDATION.PRODUCT.CATEGORY_REQUIRED),
    ),
});

export const updateProductSchema = v.object({
    name: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, ERRORS.VALIDATION.PRODUCT.NAME_REQUIRED),
    ),
    description: v.optional(v.string()),
    imageUploadId: v.string(),
    price: v.pipe(
        v.string(),
        v.regex(pricePattern, ERRORS.VALIDATION.PRODUCT.PRICE_INVALID),
    ),
    stockQuantity: v.pipe(
        v.number(),
        v.integer(ERRORS.VALIDATION.PRODUCT.STOCK_INTEGER),
        v.minValue(0, ERRORS.VALIDATION.PRODUCT.STOCK_NON_NEGATIVE),
    ),
    categoryId: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, ERRORS.VALIDATION.PRODUCT.CATEGORY_REQUIRED),
    ),
});

export type CreateProductInput = v.InferInput<typeof createProductSchema>;
export type UpdateProductInput = v.InferInput<typeof updateProductSchema>;
