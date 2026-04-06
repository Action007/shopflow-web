import { z } from "zod";

export const checkoutSchema = z.object({
    shippingAddress: z.string().min(10, "Please enter a full shipping address"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(5, "Zip code is required"),
    phone: z.string().min(10, "Phone number is required"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
