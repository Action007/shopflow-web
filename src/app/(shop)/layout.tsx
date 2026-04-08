import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { getCurrentUser } from "@/lib/auth";
import { apiAuthGet } from "@/lib/api-auth";
import type { Cart } from "@/types/cart";
import { CartProvider } from "@/providers/cart-provider";
import { API_ROUTES } from "@/lib/constants/routes";

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    let cart: Cart | null = null;
    if (user) {
        try {
            cart = await apiAuthGet<Cart>(API_ROUTES.CART, { tags: ["cart"] });
        } catch {
        }
    }

    return (
        <CartProvider initialCart={cart}>
            <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <main className="flex-1 pt-16">{children}</main>
                <Footer />
                <BottomNav />
            </div>
        </CartProvider>
    );
}
