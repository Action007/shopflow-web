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
    const wishlistProductIds = wishlist?.items.map((item) => item.productId) ?? [];

    return (
        <div className="site-page pb-16 sm:pb-32">
            <section className="mb-8 flex flex-col gap-4 rounded-[28px] border border-outline-variant/15 bg-surface-low px-6 py-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Heart className="h-7 w-7" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-on-surface">
                        Your wishlist
                    </h1>
                    <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-on-surface-variant">
                        Keep products you want to revisit, compare, or buy next.
                    </p>
                </div>

                <div className="rounded-[20px] bg-surface-high px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        Saved Items
                    </p>
                    <p className="mt-1 font-mono text-2xl text-primary">
                        {products.length}
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
