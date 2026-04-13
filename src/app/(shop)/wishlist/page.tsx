import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { requireCustomerUser } from "@/lib/route-guards";

export const metadata: Metadata = {
    title: "Wishlist",
};

export default async function WishlistPage() {
    await requireCustomerUser("/wishlist");

    return (
        <div className="site-page pb-16 sm:pb-32">
            <section className="rounded-[28px] border border-outline-variant/15 bg-surface-low px-6 py-12 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Heart className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter text-on-surface">
                    Wishlist is ready for the next step.
                </h1>
                <p className="mx-auto mt-4 max-w-[44ch] text-sm leading-relaxed text-on-surface-variant">
                    The route is in place so navigation and access control are
                    consistent. We will wire the real wishlist data flow in the
                    dedicated wishlist implementation step.
                </p>
            </section>
        </div>
    );
}
