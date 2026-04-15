import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AlertCircle, Check, ChevronRight, Shield } from "lucide-react";
import { apiGet } from "@/lib/api";
import { ApiClientError } from "@/lib/api";
import type { Product, PaginatedResult } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { ROUTES } from "@/lib/constants/routes";
import { API_ROUTES } from "@/lib/constants/routes";
import {
    CACHE_CONFIG,
    CACHE_TAGS,
    getProductTag,
} from "@/lib/constants/cache";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/roles";
import { getWishlistProductIds } from "@/lib/wishlist";
import { AppImage } from "@/components/shared/app-image";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({
    params,
}: ProductPageProps): Promise<Metadata> {
    const { id } = await params;

    try {
        const product = await apiGet<Product>(API_ROUTES.PRODUCTS.DETAIL(id), {
            revalidate: CACHE_CONFIG.CATALOG_REVALIDATE_SECONDS,
            tags: [CACHE_TAGS.PRODUCTS, getProductTag(id)],
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
        const result = await apiGet<PaginatedResult<Product>>(
            `${API_ROUTES.PRODUCTS.LIST}?limit=${CACHE_CONFIG.STATIC_PRODUCT_PARAMS_LIMIT}`,
            { tags: [CACHE_TAGS.PRODUCTS] },
        );
        return result.items.map((product) => ({ id: product.id }));
    } catch {
        return [];
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    const adminMode = isAdmin(currentUser);
    const wishlistProductIds = await getWishlistProductIds(currentUser);

    let product: Product;
    try {
        product = await apiGet<Product>(API_ROUTES.PRODUCTS.DETAIL(id), {
            revalidate: CACHE_CONFIG.CATALOG_REVALIDATE_SECONDS,
            tags: [CACHE_TAGS.PRODUCTS, getProductTag(id)],
        });
    } catch (error) {
        if (error instanceof ApiClientError && error.statusCode === 404) {
            notFound();
        }
        throw error;
    }

    const inStock = product.stockQuantity > 0;

    return (
        <div className="site-page pt-4">
            <nav className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500">
                <Link
                    href={ROUTES.HOME}
                    className="transition-colors duration-300 ease-fluid hover:text-on-surface"
                >
                    Shop
                </Link>
                <ChevronRight className="h-3 w-3" />
                {product.category ? (
                    <Link
                        href={`${ROUTES.PRODUCTS}?categoryId=${product.category.id}`}
                        className="transition-colors duration-300 ease-fluid hover:text-on-surface"
                    >
                        {product.category.name}
                    </Link>
                ) : (
                    <Link
                        href={ROUTES.PRODUCTS}
                        className="transition-colors duration-300 ease-fluid hover:text-on-surface"
                    >
                        Products
                    </Link>
                )}
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary">{product.name}</span>
            </nav>

            <div className="gap-4 md:grid md:grid-cols-2 md:items-start md:gap-8">
                <div className="mb-8 lg:mb-0">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-low">
                        {product.imageUrl ? (
                            <AppImage
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
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                            <h1 className="text-3xl font-black tracking-tighter text-on-surface lg:text-5xl">
                                {product.name}
                            </h1>
                            <div
                                className={`justify-center w-full max-w-[110px] flex items-center gap-1 rounded-md px-2 py-1 ${
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

                        <div className="mb-6 flex flex-wrap gap-3">
                            <div className="rounded-full border border-outline-variant/15 rounded-sm bg-surface-low px-3 py-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-outline">
                                    Category
                                </span>
                                <p className="mt-1 font-mono text-sm tabular-nums text-on-surface">
                                    {product.category?.name}
                                </p>
                            </div>
                            <div className="rounded-full border border-outline-variant/15 rounded-sm bg-surface-low px-3 py-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-outline">
                                    Stock
                                </span>
                                <p className="mt-1 font-mono text-sm tabular-nums text-on-surface">
                                    {product.stockQuantity} units
                                </p>
                            </div>
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

                    {adminMode ? (
                        <section className="rounded-[24px] border border-primary/20 bg-primary/5 p-5">
                            <div className="flex items-start gap-3">
                                <Shield className="mt-0.5 h-5 w-5 text-primary" />
                                <div>
                                    <h2 className="font-bold text-on-surface">
                                        Admin view
                                    </h2>
                                    <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                                        Purchase controls are hidden for admins.
                                        Continue in the admin workspace for
                                        catalog management.
                                    </p>
                                    <Link
                                        href={ROUTES.ADMIN.PRODUCTS}
                                        className="mt-4 inline-flex text-sm font-bold text-primary"
                                    >
                                        Open Admin Products
                                    </Link>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <ProductPurchasePanel
                            productId={product.id}
                            inStock={inStock}
                            stockQuantity={product.stockQuantity}
                            initialIsWishlisted={wishlistProductIds.includes(
                                product.id,
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
