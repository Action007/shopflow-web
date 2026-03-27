export function Footer() {
    return (
        <footer className="border-t py-8">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} ShopNext. Built with Next.js +
                NestJS.
            </div>
        </footer>
    );
}
