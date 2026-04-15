import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/product-grid";
import { requireCustomerUser } from "@/lib/route-guards";
import { ROUTES } from "@/lib/constants/routes";
import { ERRORS } from "@/lib/constants/errors";
import { getWishlist } from "@/lib/wishlist";

export const metadata: Metadata = {
    title: "Wishlist",
};

export default async function WishlistPage() {
    const user = await requireCustomerUser(ROUTES.WISHLIST);
    const wishlist = await getWishlist(user);
    const products = wishlist?.items.map((item) => item.product) ?? [];
    const wishlistProductIds =
        wishlist?.items.map((item) => item.productId) ?? [];

    return (
        <div className="site-page pb-16 sm:pb-32">
            <section className="mb-8 overflow-hidden rounded-[32px] border border-outline-variant/15 bg-surface-low">
                <div className="flex px-6 py-8 flex-col items-center sm:px-8 sm:py-10 text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_12px_30px_-18px_rgba(0,0,0,0.8)]">
                        <Heart className="h-8 w-8" />
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                        Saved for later
                    </p>
                    <h1 className="mt-3 text-3xl font-black tracking-tighter text-on-surface sm:text-4xl">
                        Your wishlist
                    </h1>
                    <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-on-surface-variant sm:text-[15px]">
                        Keep products you want to revisit, compare, or buy next
                        without losing track of them.
                    </p>
                </div>
            </section>

            {products.length === 0 ? (
                <section className="rounded-[28px] border border-outline-variant/15 bg-surface-low px-6 py-12 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Heart className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter text-on-surface">
                        {ERRORS.WISHLIST.EMPTY}
                    </h2>
                    <p className="mx-auto mt-4 max-w-[44ch] text-sm leading-relaxed text-on-surface-variant">
                        Save products from the catalog and they will appear here
                        for quick access later.
                    </p>
                    <Button asChild className="mt-6">
                        <Link href={ROUTES.PRODUCTS}>Browse Products</Link>
                    </Button>
                </section>
            ) : (
                <ProductGrid
                    products={products}
                    wishlistProductIds={wishlistProductIds}
                    className="grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                />
            )}
        </div>
    );
}
