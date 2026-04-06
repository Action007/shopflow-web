import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

interface OrderPreviewProps {
    items: CartItem[];
}

export function OrderPreview({ items }: OrderPreviewProps) {
    const total = items.reduce(
        (sum, item) => sum + parseFloat(item.priceAtAdd) * item.quantity,
        0,
    );

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                        <span>
                            {item.product.name} × {item.quantity}
                        </span>
                        <span>
                            {formatPrice(
                                parseFloat(item.priceAtAdd) * item.quantity,
                            )}
                        </span>
                    </div>
                ))}
                <Separator />
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </CardContent>
        </Card>
    );
}
