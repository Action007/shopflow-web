import { Skeleton } from "@/components/ui/skeleton";

function ProductCardDesktopSkeleton() {
    return (
        <article className="overflow-hidden rounded-xl bg-surface-low">
            <div className="relative aspect-square w-full overflow-hidden bg-surface-highest">
                <Skeleton className="h-full w-full rounded-none" />
                <Skeleton className="absolute left-3 top-3 h-6 w-20 rounded-full" />
            </div>

            <div className="flex h-full flex-col justify-between gap-4 p-6">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-7 w-4/5" />
                    <Skeleton className="h-7 w-3/5" />
                </div>

                <div className="space-y-4">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                </div>
            </div>
        </article>
    );
}

function ProductCardMobileSkeleton() {
    return (
        <article className="overflow-hidden rounded-xl bg-surface-low">
            <div className="flex gap-4 p-4">
                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-surface-highest">
                    <Skeleton className="h-full w-full rounded-none" />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-3 w-16" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-6 w-4/5" />
                            <Skeleton className="h-6 w-3/5" />
                        </div>

                        <Skeleton className="h-8 w-24" />
                    </div>

                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            </div>
        </article>
    );
}

interface ProductGridSkeletonProps {
    count?: number;
}

export function ProductGridSkeleton({ count = 6 }: ProductGridSkeletonProps) {
    return (
        <>
            <div className="space-y-4 sm:hidden">
                {Array.from({ length: count }).map((_, index) => (
                    <ProductCardMobileSkeleton key={index} />
                ))}
            </div>

            <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:gap-6 md:grid-cols-3">
                {Array.from({ length: count }).map((_, index) => (
                    <ProductCardDesktopSkeleton key={index} />
                ))}
            </div>
        </>
    );
}
