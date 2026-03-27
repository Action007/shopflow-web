import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/providers/toast-provider";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: {
        default: "ShopNext — E-Commerce Store",
        template: "%s | ShopNext",
    },
    description: "Modern e-commerce storefront built with Next.js App Router",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="min-h-screen bg-background font-sans antialiased">
                {children}
                <ToastProvider />
            </body>
        </html>
    );
}
