"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
    productId: string;
    disabled?: boolean;
}

export function AddToCartButton({ productId, disabled }: AddToCartButtonProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        setIsAdding(true);
        // TODO: Day 3 — call Server Action to add to cart
        console.log("Adding product to cart:", productId);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsAdding(false);
    };

    return (
        <Button
            onClick={handleAdd}
            disabled={disabled || isAdding}
            size="lg"
            className="w-full md:w-auto"
        >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isAdding ? "Adding..." : "Add to cart"}
        </Button>
    );
}
