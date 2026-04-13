import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

interface ProductGridProps {
    products: Product[];
    className?: string;
    showPurchaseActions?: boolean;
    wishlistProductIds?: string[];
}

export function ProductGrid({
    products,
    className,
    showPurchaseActions = true,
    wishlistProductIds = [],
}: ProductGridProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3",
                className,
            )}
        >
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    showPurchaseActions={showPurchaseActions}
                    isWishlisted={wishlistProductIds.includes(product.id)}
                    imagePriority={index < 10}
                />
            ))}
        </div>
    );
}
