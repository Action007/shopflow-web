import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const inStock = product.stockQuantity > 0;

    return (
        <Link href={`/products/${product.id}`}>
            <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No image
                        </div>
                    )}
                    {!inStock && (
                        <Badge
                            variant="destructive"
                            className="absolute right-2 top-2"
                        >
                            Out of stock
                        </Badge>
                    )}
                </div>

                <CardContent className="p-4">
                    <h3 className="font-medium leading-tight line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {product.category?.name}
                    </p>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                    <span className="text-lg font-bold">
                        {formatPrice(product.price)}
                    </span>
                </CardFooter>
            </Card>
        </Link>
    );
}
