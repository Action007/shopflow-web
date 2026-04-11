import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

export function Footer() {
    return (
        <footer className="bg-neutral-950 py-12 pb-28 sm:pt-30 lg:pb-12">
            <div className="site-container flex flex-col gap-10 lg:flex-row lg:justify-between">
                <div>
                    <span className="text-xl font-black tracking-tighter text-neutral-50">
                        ShopFlow
                    </span>
                    <p className="mt-2 text-sm text-neutral-500">
                        The Digital Obsidian.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8 lg:flex lg:gap-24">
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-300">
                            Browse
                        </h4>
                        <Link
                            href={ROUTES.PRODUCTS}
                            className="text-sm text-neutral-500 transition-colors duration-300 ease-fluid hover:text-blue-400"
                        >
                            Categories
                        </Link>
                        <Link
                            href={ROUTES.SUPPORT}
                            className="text-sm text-neutral-500 transition-colors duration-300 ease-fluid hover:text-blue-400"
                        >
                            Support
                        </Link>
                        <Link
                            href={ROUTES.ORDERS}
                            className="text-sm text-neutral-500 transition-colors duration-300 ease-fluid hover:text-blue-400"
                        >
                            Orders
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-300">
                            Support
                        </h4>
                        <Link
                            href={ROUTES.PROFILE}
                            className="text-sm text-neutral-500 transition-colors duration-300 ease-fluid hover:text-blue-400"
                        >
                            Profile
                        </Link>
                        <Link
                            href={ROUTES.LOGIN}
                            className="text-sm text-neutral-500 transition-colors duration-300 ease-fluid hover:text-blue-400"
                        >
                            Login
                        </Link>
                    </div>
                </div>

                <div className="border-t border-neutral-800/20 pt-8 lg:border-t-0 lg:pt-0 lg:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600">
                        © {new Date().getFullYear()} ShopFlow. The Digital
                        Obsidian.
                    </p>
                </div>
            </div>
        </footer>
    );
}
