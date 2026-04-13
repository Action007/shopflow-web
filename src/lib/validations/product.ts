import * as v from "valibot";

const pricePattern = /^\d+(\.\d{1,2})?$/;

export const createProductSchema = v.object({
    name: v.pipe(v.string(), v.trim(), v.minLength(1, "Name is required")),
    description: v.optional(v.string()),
    imageUploadId: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, "Product image is required"),
    ),
    price: v.pipe(
        v.string(),
        v.regex(
            pricePattern,
            'Price must be a valid decimal like "29.99"',
        ),
    ),
    stockQuantity: v.pipe(
        v.number(),
        v.integer("Stock quantity must be a whole number"),
        v.minValue(0, "Stock quantity cannot be negative"),
    ),
    categoryId: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, "Category is required"),
    ),
});

export const updateProductSchema = v.object({
    name: v.pipe(v.string(), v.trim(), v.minLength(1, "Name is required")),
    description: v.optional(v.string()),
    imageUploadId: v.string(),
    price: v.pipe(
        v.string(),
        v.regex(
            pricePattern,
            'Price must be a valid decimal like "29.99"',
        ),
    ),
    stockQuantity: v.pipe(
        v.number(),
        v.integer("Stock quantity must be a whole number"),
        v.minValue(0, "Stock quantity cannot be negative"),
    ),
    categoryId: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, "Category is required"),
    ),
});

export type CreateProductInput = v.InferInput<typeof createProductSchema>;
export type UpdateProductInput = v.InferInput<typeof updateProductSchema>;
