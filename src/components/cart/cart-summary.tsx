"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    useCartStore,
    selectItemCount,
    selectTotalPrice,
} from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartSummary() {
    const itemCount = useCartStore(selectItemCount);
    const totalPrice = useCartStore(selectTotalPrice);

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                        Items ({itemCount})
                    </span>
                    <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                </div>
            </CardContent>
            <CardFooter>
                {itemCount === 0 ? (
                    <Button className="w-full" disabled>
                        Proceed to checkout
                    </Button>
                ) : (
                    <Button asChild className="w-full">
                        <Link href="/checkout">Proceed to checkout</Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
