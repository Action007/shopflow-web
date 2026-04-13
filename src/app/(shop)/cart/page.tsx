import { CartContent } from "@/components/cart/cart-content";
import type { Metadata } from "next";
import { requireCustomerUser } from "@/lib/route-guards";

export const metadata: Metadata = {
    title: "Cart",
};

export default async function CartPage() {
    await requireCustomerUser("/cart");

    return (
        <div className="site-page pb-16 sm:pb-32">
            <CartContent />
        </div>
    );
}
