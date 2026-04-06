import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { apiAuthGet } from "@/lib/api-auth";
import { ApiClientError } from "@/lib/api";
import type { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

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
    if (!user) redirect("/login");

    const { id } = await params;

    let order: Order;
    try {
        order = await apiAuthGet<Order>(`/orders/${id}`);
    } catch (error) {
        if (error instanceof ApiClientError && error.statusCode === 404) {
            notFound();
        }
        throw error;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    Order #{order.orderNumber}
                </h1>
                <Badge variant="outline" className="text-base px-4 py-1">
                    {order.status}
                </Badge>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Items</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between">
                                <span>
                                    {item.productNameAtPurchase} ×{" "}
                                    {item.quantity}
                                </span>
                                <span>
                                    {formatPrice(
                                        parseFloat(item.priceAtPurchase) *
                                            item.quantity,
                                    )}
                                </span>
                            </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>{formatPrice(order.totalAmount)}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Shipping</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{order.shippingAddress}</p>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
