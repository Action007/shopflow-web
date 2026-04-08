import Link from "next/link";

export function Footer() {
    return (
        <footer className="mt-20 bg-neutral-950 px-8 py-12 pb-28 lg:px-12 lg:pb-12">
            <div className="mx-auto flex max-w-[1280px] flex-col gap-10 lg:flex-row lg:justify-between">
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
                            href="/products"
                            className="text-sm text-neutral-500 transition-colors duration-300 ease-fluid hover:text-blue-400"
                        >
                            Categories
                        </Link>
                        <Link
                            href="/order"
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
                            href="/login"
                            className="text-sm text-neutral-500 transition-colors duration-300 ease-fluid hover:text-blue-400"
                        >
                            Support
                        </Link>
                        <Link
                            href="/register"
                            className="text-sm text-neutral-500 transition-colors duration-300 ease-fluid hover:text-blue-400"
                        >
                            Privacy
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
