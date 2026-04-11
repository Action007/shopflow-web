import { Skeleton } from "@/components/ui/skeleton";

function CartItemSkeleton() {
    return (
        <div className="flex gap-4 rounded-xl bg-surface-low p-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-highest">
                <Skeleton className="h-full w-full rounded-none" />
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>

                <div className="mt-4 flex items-end justify-between gap-4">
                    <Skeleton className="h-10 w-28 rounded-lg" />
                    <div className="space-y-2 text-right">
                        <Skeleton className="ml-auto h-3 w-14" />
                        <Skeleton className="ml-auto h-7 w-20" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CartContentSkeleton() {
    return (
        <>
            <div className="mb-6 space-y-2">
                <Skeleton className="h-10 w-48" />
            </div>

            <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
                <div className="space-y-6">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <CartItemSkeleton key={index} />
                    ))}
                </div>

                <div className="mt-12 lg:mt-0">
                    <aside className="rounded-xl bg-surface-low p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-3 w-10" />
                            </div>
                            <div className="flex items-center justify-between border-t border-outline-variant/20 pt-6">
                                <Skeleton className="h-7 w-16" />
                                <Skeleton className="h-10 w-28" />
                            </div>
                        </div>

                        <Skeleton className="mt-8 h-12 w-full rounded-lg" />

                        <div className="mt-8 flex flex-col items-center gap-4">
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-4 w-36" />
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
