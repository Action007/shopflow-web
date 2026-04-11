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

    if (!user) redirect(`${ROUTES.LOGIN}?callbackUrl=${ROUTES.CHECKOUT}`);

    let cart: Cart | null = null;
    try {
        cart = await apiAuthGet<Cart>(API_ROUTES.CART, { tags: ["cart"] });
    } catch {
    }

    if (!cart || cart.items.length === 0) {
        redirect(ROUTES.CART);
    }

    return (
        <div className="site-page pb-32 pt-4 lg:grid lg:grid-cols-[1fr_380px] lg:gap-8 lg:pb-12">
            <div>
                <CheckoutForm />
            </div>
            <div className="mb-6 lg:mb-0 lg:order-2">
                <OrderPreview items={cart.items} />
            </div>
        </div>
    );
}
