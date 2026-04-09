import type { Product } from "@/types/product";
import { CatalogProductCardMobile } from "@/components/products/catalog-product-card-mobile";
import { CatalogProductCardDesktop } from "@/components/products/catalog-product-card-desktop";

interface CatalogProductGridProps {
    products: Product[];
}

export function CatalogProductGrid({ products }: CatalogProductGridProps) {
    return (
        <>
            <div className="space-y-4 sm:hidden">
                {products.map((product, index) => (
                    <CatalogProductCardMobile
                        key={product.id}
                        product={product}
                        imagePriority={index === 0}
                    />
                ))}
            </div>

            <div className="hidden sm:grid-cols-2 md:grid-cols-3 gap-4 sm:grid xl:gap-6">
                {products.map((product, index) => (
                    <CatalogProductCardDesktop
                        key={product.id}
                        product={product}
                        imagePriority={index === 0}
                    />
                ))}
            </div>
        </>
    );
}
