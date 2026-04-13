import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { cn } from "@/lib/utils";
import { API_ROUTES } from "@/lib/constants/routes";

interface CatalogProductCardMobileProps {
    product: Product;
    imagePriority?: boolean;
    showPurchaseActions?: boolean;
}

export function CatalogProductCardMobile({
    product,
    imagePriority = false,
    showPurchaseActions = true,
}: CatalogProductCardMobileProps) {
    const inStock = product.stockQuantity > 0;

    return (
        <article className="overflow-hidden rounded-xl bg-surface-low transition-all duration-300 ease-fluid hover:bg-surface-high">
            <div className="flex gap-4 p-4">
                <Link
                    href={API_ROUTES.PRODUCTS.DETAIL(product.id)}
                    className="block shrink-0"
                >
                    <div
                        className={cn(
                            "relative h-32 w-32 overflow-hidden rounded-lg bg-surface-highest",
                            !inStock && "opacity-60 grayscale",
                        )}
                    >
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                priority={imagePriority}
                                sizes="128px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-text-muted">
                                No image
                            </div>
                        )}
                    </div>
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={cn(
                                    "rounded-full bg-tertiary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-tertiary",
                                    !inStock && "bg-destructive/10 text-destructive",
                                )}
                            >
                                {inStock ? "In Stock" : "Out of Stock"}
                            </span>
                            <p className="truncate text-[10px] font-bold uppercase tracking-widest text-outline">
                                {product.category?.name ?? "Product"}
                            </p>
                        </div>

                        <Link
                            href={API_ROUTES.PRODUCTS.DETAIL(product.id)}
                            className="block"
                        >
                            <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-on-surface">
                                {product.name}
                            </h3>
                        </Link>

                        <p className="text-2xl font-black tabular-nums text-primary">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    {showPurchaseActions ? (
                        <AddToCartButton
                            productId={product.id}
                            disabled={!inStock}
                            variant="card"
                            className="h-10 rounded-lg px-4 py-2 text-xs uppercase tracking-widest"
                        />
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
