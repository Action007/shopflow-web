"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionResult } from "@/actions/auth";
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

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(
        loginAction,
        initialState,
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent className="space-y-4">
                    {state.message && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            {state.message}
                        </div>
                    )}

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
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? "Logging in..." : "Login"}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="text-primary hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
