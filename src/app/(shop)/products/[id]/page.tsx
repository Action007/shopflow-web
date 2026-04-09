import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import {
    AlertCircle,
    Check,
    ChevronRight,
} from "lucide-react";
import { apiGet } from "@/lib/api";
import { ApiClientError } from "@/lib/api";
import type { Product, PaginatedResult } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";

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
                product.description ?? `Buy ${product.name} at ShopFlow`,
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
        <div className="mx-6">
            <div className="mx-auto pb-32 pt-4 sm:max-w-[1280px]">
                <nav className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500">
                    <span>Shop</span>
                    <ChevronRight className="h-3 w-3" />
                    <span>{product.category?.name ?? "Products"}</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-primary">{product.name}</span>
                </nav>

                <div className="gap-4 md:grid md:grid-cols-2 md:items-start md:gap-8">
                    <div className="mb-8 lg:mb-0">
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-low">
                            {product.imageUrl ? (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-text-muted">
                                    No image available
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:flex lg:flex-col lg:gap-6">
                        <section className="mb-8">
                            <div className="mb-2 flex items-start justify-between gap-4">
                                <h1 className="text-4xl font-black tracking-tighter text-on-surface lg:text-5xl">
                                    {product.name}
                                </h1>
                                <div
                                    className={`flex items-center gap-1 rounded-md px-2 py-1 ${
                                        inStock
                                            ? "bg-tertiary/10"
                                            : "bg-destructive/10"
                                    }`}
                                >
                                    {inStock ? (
                                        <Check className="h-[14px] w-[14px] text-tertiary" />
                                    ) : (
                                        <AlertCircle className="h-[14px] w-[14px] text-destructive" />
                                    )}
                                    <span
                                        className={`text-[10px] font-bold uppercase tracking-wider ${
                                            inStock
                                                ? "text-tertiary"
                                                : "text-destructive"
                                        }`}
                                    >
                                        {inStock ? "In Stock" : "Unavailable"}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6 flex items-baseline gap-2">
                                <span className="text-3xl font-black text-primary-container">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-sm text-neutral-500 line-through">
                                    {formatPrice(
                                        Number.parseFloat(product.price) * 1.08,
                                    )}
                                </span>
                            </div>

                            <p className="mb-6 leading-relaxed text-on-surface-variant">
                                {product.description ??
                                    "Redefining the limits of modern hardware with precision-built materials, powerful internals, and a striking editorial silhouette."}
                            </p>

                            <ul className="mb-8 space-y-3">
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-bold text-on-surface">
                                        Precision-built premium construction
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-bold text-on-surface">
                                        Optimized for demanding everyday
                                        workflows
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-bold text-on-surface">
                                        Fast shipping and premium support
                                        included
                                    </span>
                                </li>
                            </ul>
                        </section>

                        <ProductPurchasePanel
                            productId={product.id}
                            inStock={inStock}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
