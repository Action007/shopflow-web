import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { WishlistToggleButton } from "@/components/wishlist/wishlist-toggle-button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
    imagePriority?: boolean;
    showPurchaseActions?: boolean;
    isWishlisted?: boolean;
}

export function ProductCard({
    product,
    imagePriority = false,
    showPurchaseActions = true,
    isWishlisted = false,
}: ProductCardProps) {
    const inStock = product.stockQuantity > 0;

    return (
        <article className="flex flex-col group overflow-hidden rounded-xl bg-surface-low transition-all duration-300 ease-fluid hover:bg-surface-high">
            <Link href={`/products/${product.id}`} className="block">
                <div
                    className={cn(
                        "relative aspect-square w-full overflow-hidden bg-surface-highest",
                        !inStock && "opacity-60 grayscale",
                    )}
                >
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            priority={imagePriority}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="h-full w-full object-cover transition-transform duration-500 ease-fluid group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-text-muted">
                            No image
                        </div>
                    )}

                    <span
                        className={cn(
                            "absolute left-3 top-3 rounded-full bg-tertiary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-tertiary backdrop-blur-md",
                            !inStock && "bg-destructive/10 text-destructive",
                        )}
                    >
                        {inStock ? "In Stock" : "Out of Stock"}
                    </span>
                </div>
            </Link>

            <div className="flex flex-col justify-between h-full gap-4 p-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-outline">
                        {product.category?.name ?? "Product"}
                    </p>
                    <Link href={`/products/${product.id}`} className="block">
                        <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-on-surface">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div>
                    <p className="text-2xl font-black tabular-nums text-primary mb-4">
                        {formatPrice(product.price)}
                    </p>
                    {showPurchaseActions ? (
                        <div className="flex items-center gap-2">
                            <AddToCartButton
                                productId={product.id}
                                disabled={!inStock}
                                variant="card"
                                className="rounded-lg py-3 text-sm uppercase tracking-wider"
                            />
                            <WishlistToggleButton
                                productId={product.id}
                                initialIsWishlisted={isWishlisted}
                                className="h-12 w-12 rounded-lg"
                            />
                        </div>
                    ) : (
                        <div className="rounded-lg border border-outline-variant/15 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Admin view
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
