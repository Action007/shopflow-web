import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartBadge() {
    return (
        <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
            </Link>
        </Button>
    );
}
