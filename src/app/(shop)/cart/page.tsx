import { CartContent } from "@/components/cart/cart-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cart",
};

export default function CartPage() {
    return (
        <div className="mx-4">
            <div className="pb-16 pt-8 sm:pb-32  lg:mx-auto lg:max-w-[1280px]">
                <CartContent />
            </div>
        </div>
    );
}
