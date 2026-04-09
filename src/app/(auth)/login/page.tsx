import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
    title: "Login",
};

interface LoginPageProps {
    searchParams: Promise<{
        callbackUrl?: string;
    }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const params = await searchParams;

    return <LoginForm callbackUrl={params.callbackUrl} />;
}
