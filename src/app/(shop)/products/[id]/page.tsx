import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import {
    AlertCircle,
    Check,
    ChevronRight,
    Cpu,
    Heart,
    Minus,
    Plus,
    Shield,
    Usb,
    Camera,
} from "lucide-react";
import { apiGet } from "@/lib/api";
import { ApiClientError } from "@/lib/api";
import type { Product, PaginatedResult } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Button } from "@/components/ui/button";

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
    const gallery = [product.imageUrl, product.imageUrl, product.imageUrl].filter(
        Boolean,
    ) as string[];

    return (
        <div className="mx-auto max-w-md px-6 pb-32 pt-4 lg:max-w-[1280px] lg:px-12">
            <nav className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500">
                <span>Shop</span>
                <ChevronRight className="h-3 w-3" />
                <span>{product.category?.name ?? "Products"}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary">{product.name}</span>
            </nav>

            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
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

                    <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
                        {gallery.map((image, index) => (
                            <div
                                key={`${image}-${index}`}
                                className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                                    index === 0
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-transparent"
                                }`}
                            >
                                <Image
                                    src={image}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    width={80}
                                    height={80}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-6">
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
                                    Optimized for demanding everyday workflows
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-primary" />
                                <span className="text-sm font-bold text-on-surface">
                                    Fast shipping and premium support included
                                </span>
                            </li>
                        </ul>
                    </section>

                    <section className="mb-10 grid grid-cols-2 gap-4 lg:order-3">
                        <SpecCard icon={Cpu} label="Processor" value="A18 Pro" />
                        <SpecCard
                            icon={Camera}
                            label="Main Lens"
                            value={`${Math.max(
                                12,
                                Math.min(48, product.stockQuantity + 24),
                            )}MP`}
                        />
                        <SpecCard icon={Shield} label="Material" value="Titanium" />
                        <SpecCard icon={Usb} label="I/O Port" value="USB-C 3" />
                    </section>

                    <section className="space-y-4 lg:order-4">
                        <div className="flex items-center justify-between rounded-xl bg-surface-highest p-2 px-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                Quantity
                            </span>
                            <div className="flex items-center gap-6">
                                <button
                                    type="button"
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface transition-colors duration-300 ease-fluid hover:bg-white/5"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-lg font-bold">1</span>
                                <button
                                    type="button"
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface transition-colors duration-300 ease-fluid hover:bg-white/5"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <AddToCartButton
                            productId={product.id}
                            disabled={!inStock}
                            className="w-full"
                        />

                        <Button
                            variant="outline"
                            className="w-full justify-center gap-2 py-4 text-xs uppercase tracking-widest"
                        >
                            <Heart className="h-[18px] w-[18px]" />
                            Save to Wishlist
                        </Button>
                    </section>
                </div>
            </div>
        </div>
    );
}

function SpecCard({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col gap-2 rounded-xl bg-surface-low p-5">
            <Icon className="h-5 w-5 text-primary-container" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                {label}
            </span>
            <span className="text-lg font-bold tracking-tight text-on-surface">
                {value}
            </span>
        </div>
    );
}
