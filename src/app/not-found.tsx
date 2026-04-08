import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

export default function NotFound() {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
            <h2 className="text-2xl font-bold">Page not found</h2>
            <p className="mt-2 text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button asChild className="mt-6">
                <Link href={ROUTES.HOME}>Go home</Link>
            </Button>
        </div>
    );
}
