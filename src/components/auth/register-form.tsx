"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock } from "lucide-react";
import { registerAction, type ActionResult } from "@/actions/auth";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: ActionResult = { success: false };

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(
        registerAction,
        initialState,
    );

    return (
        <main className="flex w-full max-w-md flex-col items-center">
            <div className="mb-12">
                <span className="text-[28px] font-black tracking-tighter text-on-surface">
                    ShopFlow
                </span>
            </div>

            <div className="relative w-full overflow-hidden rounded-xl border border-white/5 bg-surface-low p-8">
                <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
                <div className="relative z-10">
                    <header className="mb-8">
                        <h1 className="mb-2 text-3xl font-black tracking-tighter text-on-surface">
                            Create an account
                        </h1>
                        <p className="text-sm text-neutral-400">
                            Join the obsidian ecosystem.
                        </p>
                    </header>

                    <form action={formAction} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="First Name" error={state.fieldErrors?.firstName?.[0]}>
                                <Input id="firstName" name="firstName" placeholder="John" required />
                            </Field>
                            <Field label="Last Name" error={state.fieldErrors?.lastName?.[0]}>
                                <Input id="lastName" name="lastName" placeholder="Doe" required />
                            </Field>
                        </div>

                        <Field label="Email" error={state.fieldErrors?.email?.[0]}>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                            />
                        </Field>

                        <Field label="Password" error={state.fieldErrors?.password?.[0]}>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors duration-300 ease-fluid hover:text-primary"
                                    onClick={() => setShowPassword((value) => !value)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </Field>

                        <Field
                            label="Confirm Password"
                            error={state.fieldErrors?.confirmPassword?.[0]}
                        >
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                            />
                        </Field>

                        {state.message ? (
                            <p className="text-[10px] font-medium text-destructive">
                                {state.message}
                            </p>
                        ) : null}

                        <Button
                            type="submit"
                            variant="default"
                            className="w-full rounded-lg"
                            disabled={isPending}
                        >
                            {isPending ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>

                    <footer className="mt-8 text-center">
                        <Link
                            href={ROUTES.LOGIN}
                            className="text-sm font-medium text-primary transition-colors duration-300 ease-fluid hover:text-primary-container"
                        >
                            Already have an account? Login
                        </Link>
                    </footer>
                </div>
            </div>

            <div className="mt-8 flex items-center gap-2 opacity-40">
                <Lock className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                    Secure 256-bit Encryption
                </span>
            </div>

            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
                <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface-high opacity-20 blur-[140px]" />
            </div>
        </main>
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
            <label className="ml-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                {label}
            </label>
            {children}
            {error ? (
                <p className="text-[10px] font-medium text-destructive">{error}</p>
            ) : null}
        </div>
    );
}
