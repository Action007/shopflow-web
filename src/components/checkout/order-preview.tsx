import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types/cart";
import { AppImage } from "@/components/shared/app-image";

interface OrderPreviewProps {
    items: CartItem[];
}

export function OrderPreview({ items }: OrderPreviewProps) {
    const total = items.reduce(
        (sum, item) => sum + parseFloat(item.priceAtAdd) * item.quantity,
        0,
    );

    return (
        <aside className="lg:sticky lg:top-18">
            <section className="space-y-4 rounded-xl border border-outline-variant/10 bg-[#18181b] p-6">
                <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                    Order Summary
                </h2>

                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href={`${ROUTES.PRODUCTS}/${item.product.id}`}
                                    className="block"
                                >
                                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-neutral-800">
                                        {item.product.imageUrl ? (
                                            <AppImage
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        ) : null}
                                    </div>
                                </Link>
                                <div>
                                    <Link
                                        href={`${ROUTES.PRODUCTS}/${item.product.id}`}
                                        className="block"
                                    >
                                        <p className="text-sm font-bold text-on-surface transition-colors duration-300 ease-fluid hover:text-primary">
                                            {item.product.name}
                                        </p>
                                    </Link>
                                    <p className="text-xs text-neutral-500">
                                        Qty: {item.quantity}
                                    </p>
                                </div>
                            </div>
                            <span className="font-mono text-sm text-blue-400">
                                {formatPrice(
                                    parseFloat(item.priceAtAdd) * item.quantity,
                                )}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-2 space-y-2 border-t border-[#3f3f46]/30 pt-4">
                    <div className="flex justify-between text-xs text-neutral-400">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-400">
                        <span>Shipping</span>
                        <span className="font-mono">FREE</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 text-on-surface">
                        <span className="text-sm font-black uppercase tracking-widest">
                            Total
                        </span>
                        <span className="text-xl font-black tracking-tighter text-blue-400">
                            {formatPrice(total)}
                        </span>
                    </div>
                </div>
            </section>
        </aside>
    );
}
