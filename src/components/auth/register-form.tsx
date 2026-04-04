"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type ActionResult } from "@/actions/auth";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const initialState: ActionResult = { success: false };

export function RegisterForm() {
    const [state, formAction, isPending] = useActionState(
        registerAction,
        initialState,
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                    Enter your details to get started
                </CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent className="space-y-4">
                    {state.message && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            {state.message}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input id="firstName" name="firstName" required />
                            {state.fieldErrors?.firstName && (
                                <p className="text-sm text-destructive">
                                    {state.fieldErrors.firstName[0]}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" name="lastName" required />
                            {state.fieldErrors?.lastName && (
                                <p className="text-sm text-destructive">
                                    {state.fieldErrors.lastName[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                        {state.fieldErrors?.email && (
                            <p className="text-sm text-destructive">
                                {state.fieldErrors.email[0]}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                        />
                        {state.fieldErrors?.password && (
                            <p className="text-sm text-destructive">
                                {state.fieldErrors.password[0]}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm password
                        </Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                        />
                        {state.fieldErrors?.confirmPassword && (
                            <p className="text-sm text-destructive">
                                {state.fieldErrors.confirmPassword[0]}
                            </p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? "Creating account..." : "Register"}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href={ROUTES.LOGIN}
                            className="text-primary hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
