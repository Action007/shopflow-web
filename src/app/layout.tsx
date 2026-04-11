import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/providers/toast-provider";

const inter = localFont({
    src: [
        {
            path: "../../public/fonts/inter-latin-wght-normal.woff2",
            style: "normal",
            weight: "100 900",
        },
        {
            path: "../../public/fonts/inter-latin-wght-italic.woff2",
            style: "italic",
            weight: "100 900",
        },
    ],
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
            <body className="min-h-screen bg-background font-sans text-on-surface antialiased">
                {children}
                <ToastProvider />
            </body>
        </html>
    );
}
