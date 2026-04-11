import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
    return (
        <div className="mx-6">
            <div className="mx-auto pb-32 pt-4 sm:max-w-[1280px]">
                <div className="mb-4 flex items-center gap-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-32" />
                </div>

                <div className="gap-4 md:grid md:grid-cols-2 md:items-start md:gap-8">
                    <div className="mb-8 lg:mb-0">
                        <div className="aspect-square w-full overflow-hidden rounded-xl bg-surface-low">
                            <Skeleton className="h-full w-full rounded-none" />
                        </div>
                    </div>

                    <div className="lg:flex lg:flex-col lg:gap-6">
                        <section className="mb-8">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                                <div className="space-y-3">
                                    <Skeleton className="h-10 w-56" />
                                    <Skeleton className="h-10 w-40" />
                                </div>
                                <Skeleton className="h-8 w-[110px] rounded-md" />
                            </div>

                            <div className="mb-6 flex items-baseline gap-2">
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-5 w-20" />
                            </div>

                            <div className="mb-6 flex flex-wrap gap-3">
                                <Skeleton className="h-16 w-32 rounded-sm" />
                                <Skeleton className="h-16 w-28 rounded-sm" />
                            </div>

                            <div className="mb-6 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>

                            <div className="mb-8 space-y-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-5 rounded-full" />
                                        <Skeleton className="h-4 w-64" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4 lg:order-4">
                            <Skeleton className="h-4 w-52" />
                            <div className="rounded-xl bg-surface-low px-4 py-3">
                                <div className="flex items-center justify-between gap-3">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            </div>
                            <div className="flex w-full flex-wrap gap-2 sm:flex-nowrap">
                                <Skeleton className="h-14 w-full sm:w-[200px] rounded-xl" />
                                <Skeleton className="h-14 w-full rounded-xl" />
                            </div>
                            <Skeleton className="h-14 w-full rounded-xl" />
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
