import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
    return (
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24">
            <h2 className="text-2xl font-bold">Product not found</h2>
            <p className="mt-2 text-muted-foreground">
                The product you're looking for doesn't exist or has been
                removed.
            </p>
            <Button asChild className="mt-6">
                <Link href="/products">Browse products</Link>
            </Button>
        </div>
    );
}
