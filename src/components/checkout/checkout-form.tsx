"use client";

import { useState } from "react";
import { CreditCard, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { placeOrderAction } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ERRORS } from "@/lib/constants/errors";
import { cn } from "@/lib/utils";

export function CheckoutForm() {
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CheckoutInput>({
        resolver: valibotResolver(checkoutSchema),
    });

    const onSubmit = async (data: CheckoutInput) => {
        setServerError(null);
        const result = await placeOrderAction(data);

        if (!result.success) {
            setServerError(result.message || ERRORS.ORDER.PLACE_FAILED);
            toast.error(ERRORS.ORDER.PLACE_FAILED, {
                description: result.message || ERRORS.GENERIC.TRY_AGAIN,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section className="rounded-xl border border-[#3f3f46]/20 bg-[#18181b] p-6 order-2 lg:order-1">
                <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                    Shipping Information
                </h2>

                <div className="space-y-5">
                    {serverError && (
                        <p className="text-[10px] font-medium text-destructive">
                            {serverError}
                        </p>
                    )}

                    <Field
                        label="Shipping Address"
                        error={errors.shippingAddress?.message}
                    >
                        <Input
                            id="shippingAddress"
                            placeholder="123 Digital Obsidian Way"
                            className={cn(
                                "border-none bg-neutral-900 focus-visible:ring-blue-500/50",
                                errors.shippingAddress &&
                                    "border border-destructive/30",
                            )}
                            {...register("shippingAddress")}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="City" error={errors.city?.message}>
                            <Input
                                id="city"
                                placeholder="Neo Tokyo"
                                className="border-none bg-neutral-900 focus-visible:ring-blue-500/50"
                                {...register("city")}
                            />
                        </Field>
                        <Field label="State" error={errors.state?.message}>
                            <Input
                                id="state"
                                placeholder="Kanto"
                                className="border-none bg-neutral-900 focus-visible:ring-blue-500/50"
                                {...register("state")}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Zip Code" error={errors.zipCode?.message}>
                            <Input
                                id="zipCode"
                                placeholder="100-0001"
                                className={cn(
                                    "border-none bg-neutral-900 focus-visible:ring-blue-500/50",
                                    errors.zipCode && "border border-destructive/30",
                                )}
                                {...register("zipCode")}
                            />
                        </Field>
                        <Field label="Phone" error={errors.phone?.message}>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+81 90-0000"
                                className="border-none bg-neutral-900 focus-visible:ring-blue-500/50"
                                {...register("phone")}
                            />
                        </Field>
                    </div>

                    <div className="pt-4">
                        <div className="flex items-center justify-between rounded-lg border border-neutral-800/50 bg-neutral-950/50 p-4">
                            <div className="flex items-center gap-3">
                                <CreditCard className="h-4 w-4 text-blue-400" />
                                <span className="text-xs font-bold text-neutral-300">
                                    Apple Pay / Obsidian Card
                                </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-neutral-600" />
                        </div>
                    </div>

                    <div className="hidden lg:block lg:pt-4">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full shadow-[0_8px_32px_rgba(77,142,255,0.3)]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Placing Order" : "Place Order"}
                        </Button>
                        <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-neutral-500">
                            Secure encrypted checkout
                        </p>
                    </div>
                </div>
            </section>

            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent p-6 lg:hidden">
                <Button
                    type="submit"
                    size="lg"
                    className="w-full shadow-[0_8px_32px_rgba(77,142,255,0.3)]"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Placing Order" : "Place Order"}
                </Button>
                <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-neutral-500">
                    Secure encrypted checkout
                </p>
            </div>
        </form>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                {label}
            </label>
            {children}
            {error ? (
                <p className="text-[10px] font-medium text-destructive">{error}</p>
            ) : null}
        </div>
    );
}
