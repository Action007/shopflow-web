"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock } from "lucide-react";
import { registerAction, type ActionResult } from "@/actions/auth";
import { ROUTES } from "@/lib/constants/routes";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: ActionResult = { success: false };

interface RegisterFormProps {
    callbackUrl?: string;
}

export function RegisterForm({ callbackUrl }: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(
        registerAction,
        initialState,
    );

    const loginHref = callbackUrl
        ? `${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : ROUTES.LOGIN;

    return (
        <AuthShell
            backgroundVariant="register"
            brandSize="lg"
            footer={
                <div className="flex items-center gap-2 opacity-40">
                    <Lock className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                        Secure 256-bit Encryption
                    </span>
                </div>
            }
        >
            <header className="mb-8">
                <h1 className="mb-2 text-3xl font-black tracking-tighter text-on-surface">
                    Create an account
                </h1>
                <p className="text-sm text-neutral-400">
                    Join the obsidian ecosystem.
                </p>
            </header>

            <form action={formAction} className="space-y-6">
                <input
                    type="hidden"
                    name="callbackUrl"
                    value={callbackUrl ?? ROUTES.HOME}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Field
                        label="First Name"
                        error={state.fieldErrors?.firstName?.[0]}
                    >
                        <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            defaultValue={state.values?.firstName ?? ""}
                            required
                        />
                    </Field>
                    <Field
                        label="Last Name"
                        error={state.fieldErrors?.lastName?.[0]}
                    >
                        <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            defaultValue={state.values?.lastName ?? ""}
                            required
                        />
                    </Field>
                </div>

                <Field label="Email" error={state.fieldErrors?.email?.[0]}>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        defaultValue={state.values?.email ?? ""}
                        required
                    />
                </Field>

                <Field
                    label="Password"
                    error={state.fieldErrors?.password?.[0]}
                >
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            defaultValue={state.values?.password ?? ""}
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
                        defaultValue={state.values?.confirmPassword ?? ""}
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

            <div className="mt-8 text-center">
                <p className="text-sm text-on-surface-variant">
                    Already have an account?
                    <Link
                        href={loginHref}
                        className="ml-1 font-bold text-primary transition-all duration-300 ease-fluid hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </AuthShell>
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
                <p className="text-[10px] font-medium text-destructive">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
