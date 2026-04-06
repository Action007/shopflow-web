import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { apiAuthGet } from "@/lib/api-auth";
import type { Order } from "@/types/order";
import type { PaginatedResult } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Orders",
};

const statusVariant: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
> = {
    PENDING: "outline",
    PROCESSING: "secondary",
    SHIPPED: "default",
    DELIVERED: "default",
    CANCELLED: "destructive",
};

export default async function OrdersPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login?callbackUrl=/orders");

    const result = await apiAuthGet<PaginatedResult<Order>>("/orders", {
        tags: ["orders"],
    });

    if (result.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">Order History</h1>
                <p className="text-muted-foreground">
                    You haven't placed any orders yet.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Order History</h1>
            <div className="space-y-4">
                {result.items.map((order) => (
                    <Link key={order.id} href={`/orders/${order.id}`}>
                        <Card className="transition-colors hover:bg-accent/50">
                            <CardContent className="flex items-center justify-between p-6">
                                <div>
                                    <p className="font-medium">
                                        Order #{order.orderNumber}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(
                                            order.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge
                                        variant={
                                            statusVariant[order.status] ??
                                            "outline"
                                        }
                                    >
                                        {order.status}
                                    </Badge>
                                    <span className="font-semibold">
                                        {formatPrice(order.totalAmount)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
