const LOCAL_IMAGE_HOSTS = new Set(["localhost", "127.0.0.1"]);

export function shouldBypassImageOptimization(
    src: string | null | undefined,
) {
    if (!src || src.startsWith("/")) {
        return false;
    }

    try {
        const url = new URL(src);

        return (
            url.protocol === "http:" &&
            LOCAL_IMAGE_HOSTS.has(url.hostname) &&
            url.pathname.startsWith("/uploads/")
        );
    } catch {
        return false;
    }
}
