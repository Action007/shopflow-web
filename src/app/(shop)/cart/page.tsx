import { CartContent } from "@/components/cart/cart-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cart",
};

export default function CartPage() {
    return (
        <div className="px-6 pb-32 pt-8 lg:mx-auto lg:max-w-[1280px] lg:px-12">
            <CartContent />
        </div>
    );
}
