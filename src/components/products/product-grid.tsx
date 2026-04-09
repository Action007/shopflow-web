import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

interface ProductGridProps {
    products: Product[];
    className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
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
                    imagePriority={index < 10}
                />
            ))}
        </div>
    );
}
