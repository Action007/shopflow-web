import ShopLayout from "@/app/(shop)/layout";
import HomePage from "@/app/(shop)/page";

export default async function RootHomePage() {
    return (
        <ShopLayout>
            <HomePage />
        </ShopLayout>
    );
}
