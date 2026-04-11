import { Skeleton } from "@/components/ui/skeleton";

export function ProductsToolbarSkeleton() {
    return (
        <section className="mb-6 justify-between lg:flex">
            <div className="mb-4 flex items-end justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </div>

            <div className="space-y-4">
                <Skeleton className="h-10 w-full lg:hidden" />
                <div className="hidden items-center justify-between gap-4 lg:flex">
                    <Skeleton className="h-10 w-full max-w-md" />
                </div>
            </div>
        </section>
    );
}
