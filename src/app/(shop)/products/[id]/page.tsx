import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import { ApiClientError } from "@/lib/api";
import type { Product, PaginatedResult } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({
    params,
}: ProductPageProps): Promise<Metadata> {
    const { id } = await params;

    try {
        const product = await apiGet<Product>(`/products/${id}`, {
            revalidate: 300,
        });
        return {
            title: product.name,
            description:
                product.description ?? `Buy ${product.name} at ShopNext`,
            openGraph: {
                title: product.name,
                description: product.description ?? undefined,
                images: product.imageUrl ? [product.imageUrl] : undefined,
            },
        };
    } catch {
        return { title: "Product Not Found" };
    }
}

export async function generateStaticParams() {
    try {
        const result =
            await apiGet<PaginatedResult<Product>>("/products?limit=50");
        return result.items.map((product) => ({ id: product.id }));
    } catch {
        return [];
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;

    let product: Product;
    try {
        product = await apiGet<Product>(`/products/${id}`, {
            revalidate: 300,
            tags: [`product-${id}`],
        });
    } catch (error) {
        if (error instanceof ApiClientError && error.statusCode === 404) {
            notFound();
        }
        throw error;
    }

    const inStock = product.stockQuantity > 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid gap-8 md:grid-cols-2">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No image available
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <div>
                        {product.category && (
                            <p className="text-sm text-muted-foreground">
                                {product.category.name}
                            </p>
                        )}
                        <h1 className="mt-1 text-3xl font-bold">
                            {product.name}
                        </h1>
                        <p className="mt-4 text-3xl font-bold">
                            {formatPrice(product.price)}
                        </p>

                        <div className="mt-4">
                            {inStock ? (
                                <Badge variant="secondary">
                                    {product.stockQuantity} in stock
                                </Badge>
                            ) : (
                                <Badge variant="destructive">
                                    Out of stock
                                </Badge>
                            )}
                        </div>
                    </div>

                    {product.description && (
                        <p className="mt-6 text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    )}

                    <div className="mt-8">
                        <AddToCartButton
                            productId={product.id}
                            disabled={!inStock}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
