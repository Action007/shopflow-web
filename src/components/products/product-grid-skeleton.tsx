export function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                    <div className="aspect-square w-full rounded-xl shimmer" />
                    <div className="h-4 w-3/4 rounded-full shimmer" />
                    <div className="h-3 w-1/2 rounded-full shimmer opacity-50" />
                </div>
            ))}
        </div>
    );
}
