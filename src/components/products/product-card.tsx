import Link from "next/link";
import { AppImage } from "@/components/shared/app-image";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { WishlistToggleButton } from "@/components/wishlist/wishlist-toggle-button";
import { cn } from "@/lib/utils";
import { API_ROUTES } from "@/lib/constants/routes";

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
    const productHref = API_ROUTES.PRODUCTS.DETAIL(product.id);
    const stockLabel = inStock ? "In Stock" : "Out of Stock";

    return (
        <article className="group overflow-hidden rounded-xl bg-surface-low transition-all duration-300 ease-fluid hover:bg-surface-high">
            <div className="flex gap-4 p-4 sm:p-0 sm:flex-col sm:h-full">
                <Link href={productHref} className="block shrink-0">
                    <div
                        className={cn(
                            "relative h-32 w-32 overflow-hidden rounded-lg bg-surface-highest sm:h-auto sm:w-full sm:rounded-none sm:aspect-square",
                            !inStock && "opacity-60 grayscale",
                        )}
                    >
                        {product.imageUrl ? (
                            <AppImage
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                priority={imagePriority}
                                sizes="(max-width: 640px) 128px, (max-width: 1024px) 50vw, 33vw"
                                className="h-full w-full object-cover transition-transform duration-500 ease-fluid group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-text-muted">
                                No image
                            </div>
                        )}

                        <span
                            className={cn(
                                "absolute left-3 top-3 hidden rounded-full bg-tertiary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-tertiary backdrop-blur-md sm:inline-flex",
                                !inStock && "bg-destructive/10 text-destructive",
                            )}
                        >
                            {stockLabel}
                        </span>
                    </div>
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:h-full sm:gap-4 sm:p-6">
                    <div className="space-y-2 sm:space-y-1">
                        <div className="flex flex-wrap items-center gap-2 sm:hidden">
                            <span
                                className={cn(
                                    "rounded-full bg-tertiary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-tertiary",
                                    !inStock &&
                                        "bg-destructive/10 text-destructive",
                                )}
                            >
                                {stockLabel}
                            </span>
                            <p className="truncate text-[10px] font-bold uppercase tracking-widest text-outline">
                                {product.category?.name ?? "Product"}
                            </p>
                        </div>

                        <p className="hidden text-[10px] font-bold uppercase tracking-widest text-outline sm:block">
                            {product.category?.name ?? "Product"}
                        </p>

                        <Link href={productHref} className="block">
                            <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-on-surface sm:text-xl">
                                {product.name}
                            </h3>
                        </Link>

                        <p className="text-2xl font-black tabular-nums text-primary">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    <div className="sm:pt-1">
                        {showPurchaseActions ? (
                        <div className="flex flex-col items-center gap-2">
                            <AddToCartButton
                                productId={product.id}
                                disabled={!inStock}
                                variant="card"
                                className="h-10 rounded-lg bg-primary px-4 py-2 text-xs uppercase tracking-widest text-on-primary hover:bg-primary sm:h-auto sm:bg-surface-highest sm:px-0 sm:py-3 sm:text-sm sm:tracking-wider sm:text-on-surface sm:hover:bg-primary sm:hover:text-on-primary"
                            />
                            <WishlistToggleButton
                                productId={product.id}
                                initialIsWishlisted={isWishlisted}
                            />
                        </div>
                        ) : (
                            <div className="rounded-lg border border-outline-variant/15 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                                Admin view
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
