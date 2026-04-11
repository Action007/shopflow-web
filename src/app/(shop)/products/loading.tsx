import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";
import { ProductsToolbarSkeleton } from "@/components/products/products-toolbar-skeleton";

export default function ProductsLoading() {
    return (
        <div className="site-page py-8">
            <ProductsToolbarSkeleton />
            <div className="mt-8">
                <ProductGridSkeleton />
            </div>
        </div>
    );
}
