"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cancelOrderAction } from "@/actions/order";

interface CancelOrderButtonProps {
    orderId: string;
}

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleCancel = () => {
        startTransition(async () => {
            const result = await cancelOrderAction(orderId);

            if (!result.success) {
                toast.error("Could not cancel order", {
                    description: result.message,
                });
                return;
            }

            toast.success("Order cancelled");
            router.refresh();
        });
    };

    return (
        <Button
            type="button"
            variant="destructive"
            className="w-fit"
            disabled={isPending}
            onClick={handleCancel}
        >
            {isPending ? "Cancelling..." : "Cancel Order"}
        </Button>
    );
}
