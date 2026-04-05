import { CartContent } from "@/components/cart/cart-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cart",
};

export default function CartPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
            <CartContent />
        </div>
    );
}
