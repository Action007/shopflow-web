import Image, { type ImageProps } from "next/image";
import { shouldBypassImageOptimization } from "@/lib/image";

export function AppImage({ src, unoptimized, ...props }: ImageProps) {
    const shouldBypassOptimization =
        typeof src === "string" && shouldBypassImageOptimization(src);

    return (
        <Image
            src={src}
            unoptimized={unoptimized ?? shouldBypassOptimization}
            {...props}
        />
    );
}
