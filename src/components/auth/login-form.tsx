"use client";

import { AlertCircle } from "lucide-react";
import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionResult } from "@/actions/auth";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: ActionResult = { success: false };

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(
        loginAction,
        initialState,
    );

    return (
        <main className="w-full max-w-md">
            <div className="mb-12 flex justify-center">
                <span className="text-[22px] font-black tracking-tighter text-on-surface">
                    ShopFlow
                </span>
            </div>

            <div className="w-full rounded-xl border border-outline-variant/10 bg-surface-low p-8 shadow-2xl">
                <div className="mb-8">
                    <h1 className="mb-2 text-[36px] font-bold leading-tight tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm font-medium text-on-surface-variant">
                        Login to your account
                    </p>
                </div>

                <form action={formAction}>
                    <div className="space-y-6">
                        {state.message && (
                            <div className="mb-6 flex items-center gap-3 rounded-r-lg border-l-4 border-destructive bg-error-container/20 p-4">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                                <p className="text-sm font-semibold text-destructive">
                                    {state.message}
                                </p>
                            </div>
                        )}

                        <Field label="Email Address">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                            />
                            {state.fieldErrors?.email && (
                                <p className="text-[10px] font-medium text-destructive">
                                    {state.fieldErrors.email[0]}
                                </p>
                            )}
                        </Field>

                        <Field
                            label="Password"
                            action={
                                <Link
                                    href="#"
                                    className="text-[10px] font-bold text-primary transition-colors duration-300 ease-fluid hover:text-primary-container"
                                >
                                    FORGOT?
                                </Link>
                            }
                        >
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                            />
                            {state.fieldErrors?.password && (
                                <p className="text-[10px] font-medium text-destructive">
                                    {state.fieldErrors.password[0]}
                                </p>
                            )}
                        </Field>

                        <Button
                            type="submit"
                            className="w-full text-sm uppercase tracking-widest text-[var(--color-on-primary)]"
                            disabled={isPending}
                        >
                            {isPending ? "Logging In..." : "Login"}
                        </Button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-on-surface-variant">
                        Don&apos;t have an account?
                        <Link
                            href={ROUTES.REGISTER}
                            className="ml-1 font-bold text-primary transition-all duration-300 ease-fluid hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>

            <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        </main>
    );
}

function Field({
    label,
    action,
    children,
}: {
    label: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <div className="ml-1 flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {label}
                </label>
                {action}
            </div>
            {children}
        </div>
    );
}
