"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { placeOrderAction } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ERRORS } from "@/lib/constants/errors";

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
        <Card>
            <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {serverError && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            {serverError}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="shippingAddress">Address</Label>
                        <Input
                            id="shippingAddress"
                            placeholder="123 Main St, Apt 4"
                            {...register("shippingAddress")}
                        />
                        {errors.shippingAddress && (
                            <p className="text-sm text-destructive">
                                {errors.shippingAddress.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" {...register("city")} />
                            {errors.city && (
                                <p className="text-sm text-destructive">
                                    {errors.city.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" {...register("state")} />
                            {errors.state && (
                                <p className="text-sm text-destructive">
                                    {errors.state.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="zipCode">Zip Code</Label>
                            <Input id="zipCode" {...register("zipCode")} />
                            {errors.zipCode && (
                                <p className="text-sm text-destructive">
                                    {errors.zipCode.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                {...register("phone")}
                            />
                            {errors.phone && (
                                <p className="text-sm text-destructive">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Placing order..." : "Place Order"}
                    </Button>
                </CardContent>
            </form>
        </Card>
    );
}
