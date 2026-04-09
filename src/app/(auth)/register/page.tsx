import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
    title: "Register",
};

interface RegisterPageProps {
    searchParams: Promise<{
        callbackUrl?: string;
    }>;
}

export default async function RegisterPage({
    searchParams,
}: RegisterPageProps) {
    const params = await searchParams;

    return <RegisterForm callbackUrl={params.callbackUrl} />;
}
