import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { getCurrentUser } from "@/lib/auth";
import { apiAuthGet } from "@/lib/api-auth";
import { CACHE_TAGS } from "@/lib/constants/cache";
import type { Cart } from "@/types/cart";
import { CartProvider } from "@/providers/cart-provider";
import { API_ROUTES } from "@/lib/constants/routes";
import { canAccessShopperFeatures } from "@/lib/roles";

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    let cart: Cart | null = null;
    if (user && canAccessShopperFeatures(user)) {
        try {
            cart = await apiAuthGet<Cart>(API_ROUTES.CART.ROOT, {
                tags: [CACHE_TAGS.CART],
            });
        } catch {
        }
    }

    return (
        <CartProvider initialCart={cart}>
            <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <main className="flex-1 pt-14">{children}</main>
                <Footer />
            </div>
        </CartProvider>
    );
}
