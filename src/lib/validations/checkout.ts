import * as v from "valibot";
import { ERRORS } from "@/lib/constants/errors";

export const checkoutSchema = v.object({
    shippingAddress: v.pipe(v.string(), v.minLength(10, ERRORS.CHECKOUT.SHIPPING_ADDRESS_INVALID)),
    city: v.pipe(v.string(), v.minLength(1, ERRORS.CHECKOUT.CITY_REQUIRED)),
    state: v.pipe(v.string(), v.minLength(1, ERRORS.CHECKOUT.STATE_REQUIRED)),
    zipCode: v.pipe(v.string(), v.minLength(5, ERRORS.CHECKOUT.ZIP_CODE_INVALID)),
    phone: v.pipe(v.string(), v.minLength(10, ERRORS.CHECKOUT.PHONE_INVALID)),
});

export type CheckoutInput = v.InferInput<typeof checkoutSchema>;
