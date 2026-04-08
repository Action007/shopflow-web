import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { CreditCard, Truck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { apiAuthGet } from "@/lib/api-auth";
import { ApiClientError } from "@/lib/api";
import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { ROUTES, API_ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";

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
        <div className="mx-auto max-w-md px-6 pb-32 pt-8 lg:max-w-[1280px] lg:px-12">
            <section className="mb-8">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className="rounded-full bg-tertiary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-tertiary">
                            {order.status}
                        </span>
                        <span className="font-mono text-xs text-neutral-500">
                            #{order.orderNumber}
                        </span>
                    </div>
                    <h2 className="text-[36px] font-black leading-tight tracking-tighter text-on-surface">
                        Order #{order.orderNumber}
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                <div className="space-y-4">
                    <section className="space-y-6 rounded-xl bg-surface-low p-6 transition-all duration-300 ease-fluid hover:bg-surface-container">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start justify-between"
                            >
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 rounded-lg bg-surface-highest" />
                                    <div>
                                        <h3 className="font-bold text-on-surface">
                                            {item.productNameAtPurchase}
                                        </h3>
                                        <p className="text-sm text-neutral-500">
                                            Premium configuration
                                        </p>
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
                                <span className="text-neutral-500">Subtotal</span>
                                <span className="text-on-surface">
                                    {formatPrice(order.totalAmount)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Shipping</span>
                                <span className="text-[10px] font-bold uppercase text-tertiary">
                                    Free
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Tax</span>
                                <span className="text-on-surface">$0.00</span>
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
                        <Button variant="destructive" className="w-fit">
                            Cancel Order
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
