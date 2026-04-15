import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { apiAuthGet } from "@/lib/api-auth";
import { CACHE_TAGS } from "@/lib/constants/cache";
import type { Cart } from "@/types/cart";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderPreview } from "@/components/checkout/order-preview";
import { ROUTES, API_ROUTES } from "@/lib/constants/routes";
import { requireCustomerUser } from "@/lib/route-guards";

export const metadata: Metadata = {
    title: "Checkout",
};

export default async function CheckoutPage() {
    await requireCustomerUser(ROUTES.CHECKOUT);

    let cart: Cart | null = null;
    try {
        cart = await apiAuthGet<Cart>(API_ROUTES.CART.ROOT, {
            tags: [CACHE_TAGS.CART],
        });
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
