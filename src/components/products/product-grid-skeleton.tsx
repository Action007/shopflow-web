import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <CardContent className="p-4">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="mt-2 h-4 w-1/2" />
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                        <Skeleton className="h-6 w-20" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
