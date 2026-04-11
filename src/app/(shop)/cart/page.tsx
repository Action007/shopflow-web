import { CartContent } from "@/components/cart/cart-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cart",
};

export default function CartPage() {
    return (
        <div className="site-page pb-16 sm:pb-32">
            <CartContent />
        </div>
    );
}
