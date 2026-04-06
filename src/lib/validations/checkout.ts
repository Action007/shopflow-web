import * as v from "valibot";

export const checkoutSchema = v.object({
    shippingAddress: v.pipe(v.string(), v.minLength(10, "Please enter a full shipping address")),
    city: v.pipe(v.string(), v.minLength(1, "City is required")),
    state: v.pipe(v.string(), v.minLength(1, "State is required")),
    zipCode: v.pipe(v.string(), v.minLength(5, "Zip code is required")),
    phone: v.pipe(v.string(), v.minLength(10, "Phone number is required")),
});

export type CheckoutInput = v.InferInput<typeof checkoutSchema>;
