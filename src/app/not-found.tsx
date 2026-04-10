import Link from "next/link";
import { Bolt, Satellite, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

export default function NotFound() {
    return (
        <div className="dot-grid relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-6">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
                <h1 className="mb-4 bg-gradient-to-br from-primary to-primary-container bg-clip-text text-[120px] font-black leading-none tracking-tighter text-transparent drop-shadow-[0_0_30px_rgba(173,198,255,0.3)] md:text-[180px]">
                    404
                </h1>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-on-surface md:text-5xl">
                    Lost in the void.
                </h2>
                <p className="mx-auto mb-12 max-w-md text-lg text-on-surface-variant md:text-xl">
                    This page doesn&apos;t exist. It may have moved, or the
                    path was never part of this dimension.
                </p>

                <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
                    <Button asChild size="lg" className="w-full md:w-auto">
                        <Link href={ROUTES.HOME}>Go to Homepage</Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full border-outline-variant/30 text-primary md:w-auto"
                    >
                        <Link href={ROUTES.PRODUCTS}>Browse Products</Link>
                    </Button>
                </div>

                <div className="mt-20 flex items-center gap-10 opacity-20 grayscale">
                    <ShoppingBag className="h-12 w-12" />
                    <Bolt className="h-16 w-16" />
                    <Satellite className="h-12 w-12" />
                </div>
            </div>
        </div>
    );
}
