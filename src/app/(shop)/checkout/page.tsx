import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { apiAuthGet } from "@/lib/api-auth";
import type { Cart } from "@/types/cart";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderPreview } from "@/components/checkout/order-preview";
import { ROUTES, API_ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
    title: "Checkout",
};

export default async function CheckoutPage() {
    const user = await getCurrentUser();

    // TODO: Check redirect functionality for unauthorized
    if (!user) redirect(`${ROUTES.LOGIN}?callbackUrl=${ROUTES.CHECKOUT}`);

    let cart: Cart | null = null;
    try {
        cart = await apiAuthGet<Cart>(API_ROUTES.CART);
    } catch {
        // No cart
    }

    if (!cart || cart.items.length === 0) {
        redirect(ROUTES.CART);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <CheckoutForm />
                </div>
                <div>
                    <OrderPreview items={cart.items} />
                </div>
            </div>
        </div>
    );
}
