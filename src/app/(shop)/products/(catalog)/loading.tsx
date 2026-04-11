import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";
import { ProductsToolbarSkeleton } from "@/components/products/products-toolbar-skeleton";

function ProductsFiltersSkeleton() {
    return (
        <aside className="hidden lg:block lg:w-60 lg:shrink-0 lg:self-start lg:rounded-xl lg:bg-surface-low lg:p-6 lg:sticky lg:top-24">
            <div className="space-y-8">
                <section>
                    <Skeleton className="mb-4 h-3 w-20" />
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                </section>

                <section>
                    <Skeleton className="mb-4 h-3 w-24" />
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                </section>

                <section>
                    <Skeleton className="mb-4 h-3 w-16" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </section>

                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
        </aside>
    );
}

export default function ProductsLoading() {
    return (
        <div className="site-page lg:flex lg:gap-8">
            <ProductsFiltersSkeleton />

            <div className="mx-full w-full sm:max-w-none lg:flex-1">
                <ProductsToolbarSkeleton />
                <div className="mt-8">
                    <ProductGridSkeleton />
                </div>
            </div>
        </div>
    );
}
