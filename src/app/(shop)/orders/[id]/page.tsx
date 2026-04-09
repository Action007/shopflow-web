import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { CreditCard, Truck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { apiAuthGet } from "@/lib/api-auth";
import { ApiClientError } from "@/lib/api";
import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { ROUTES, API_ROUTES } from "@/lib/constants/routes";
import { CancelOrderButton } from "@/components/order/cancel-order-button";
import { OrderStatusBadge } from "@/components/order/order-status-badge";

interface OrderPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({
    params,
}: OrderPageProps): Promise<Metadata> {
    const { id } = await params;
    return { title: `Order ${id.slice(0, 8)}` };
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
    const user = await getCurrentUser();
    if (!user) redirect(ROUTES.LOGIN);

    const { id } = await params;

    let order: Order;
    try {
        order = await apiAuthGet<Order>(`${API_ROUTES.ORDERS}/${id}`);
    } catch (error) {
        if (error instanceof ApiClientError && error.statusCode === 404) {
            notFound();
        }
        throw error;
    }

    return (
        <div className="mx-4">
            <div className="pb-16 pt-8 max-w-[1280px] mx-auto sm:pb-32">
                <section className="mb-8">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <OrderStatusBadge status={order.status} />
                            <span className="font-mono text-xs text-neutral-500">
                                #{order.orderNumber}
                            </span>
                        </div>
                        <h2 className="text-3xl font-black leading-tight tracking-tighter text-on-surface">
                            Order #{order.orderNumber}
                        </h2>
                        <p className="text-sm text-neutral-500">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
                    <div className="space-y-4">
                        <section className="space-y-6 rounded-xl bg-surface-low p-6 transition-all duration-300 ease-fluid hover:bg-surface-container">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start justify-between gap-2"
                                >
                                    <div className="flex gap-4">
                                        <div>
                                            <Link
                                                href={`${ROUTES.PRODUCTS}/${item.productId}`}
                                                className="block"
                                            >
                                                <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-surface-highest">
                                                    {item.product?.imageUrl ? (
                                                        <Image
                                                            src={
                                                                item.product
                                                                    .imageUrl
                                                            }
                                                            alt={
                                                                item.productNameAtPurchase
                                                            }
                                                            fill
                                                            sizes="64px"
                                                            className="object-cover"
                                                        />
                                                    ) : null}
                                                </div>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link
                                                href={`${ROUTES.PRODUCTS}/${item.productId}`}
                                                className="block"
                                            >
                                                <h3 className="font-bold text-on-surface transition-colors duration-300 ease-fluid hover:text-primary">
                                                    {item.productNameAtPurchase}
                                                </h3>
                                            </Link>
                                            <p className="mt-1 text-sm text-on-surface">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-on-surface">
                                        {formatPrice(
                                            parseFloat(item.priceAtPurchase) *
                                                item.quantity,
                                        )}
                                    </span>
                                </div>
                            ))}

                            <div className="space-y-3 border-t border-outline-variant/10 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500">
                                        Subtotal
                                    </span>
                                    <span className="text-on-surface">
                                        {formatPrice(order.totalAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500">
                                        Shipping
                                    </span>
                                    <span className="text-[10px] font-bold uppercase text-tertiary">
                                        Free
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500">
                                        Tax
                                    </span>
                                    <span className="text-on-surface">
                                        $0.00
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-outline-variant/20 pt-4">
                                    <span className="text-lg font-black tracking-tight">
                                        Total
                                    </span>
                                    <span className="text-lg font-black tracking-tight text-primary">
                                        {formatPrice(order.totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-4">
                        <section className="space-y-4 rounded-xl bg-surface-low p-6">
                            <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-primary" />
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                    Shipping Details
                                </h4>
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold">Delivery Contact</p>
                                <p className="text-sm leading-relaxed text-neutral-500">
                                    {order.shippingAddress}
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4 rounded-xl bg-surface-low p-6">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-primary" />
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                    Payment Method
                                </h4>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="rounded border border-outline-variant/20 bg-surface-highest px-2 py-1 text-[10px] font-mono">
                                    VISA
                                </div>
                                <p className="text-sm text-on-surface">
                                    Ending in •••• 9012
                                </p>
                            </div>
                        </section>

                        {order.status === "PENDING" && (
                            <CancelOrderButton orderId={order.id} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
