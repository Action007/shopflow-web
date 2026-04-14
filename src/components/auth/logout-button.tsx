"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
    compactLabel?: string;
    className?: string;
}

export function LogoutButton({
    compactLabel = "Logout",
    className,
}: LogoutButtonProps) {
    return (
        <form action={logoutAction}>
            <Button
                variant="secondary"
                type="submit"
                className={cn(
                    "h-10 rounded-full px-4 text-on-surface",
                    className,
                )}
            >
                <LogOut className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">
                    {compactLabel}
                </span>
            </Button>
        </form>
    );
}
