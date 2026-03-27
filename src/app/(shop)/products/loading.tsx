import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="mt-2 h-5 w-64" />
            <div className="mt-8">
                <ProductGridSkeleton />
            </div>
        </div>
    );
}
