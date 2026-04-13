"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteUploadAction, uploadImageAction } from "@/actions/upload";
import type { UploadResource } from "@/types/upload";

const ALLOWED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export interface ImageUploadValue {
    uploadId: string | null;
    previewUrl: string | null;
    existingUrl?: string | null;
}

interface ImageUploadFieldProps {
    label: string;
    helpText?: string;
    value: ImageUploadValue;
    disabled?: boolean;
    required?: boolean;
    onChange: (value: ImageUploadValue) => void;
}

export function ImageUploadField({
    label,
    helpText,
    value,
    disabled,
    required,
    onChange,
}: ImageUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const displayUrl = value.previewUrl ?? value.existingUrl ?? null;

    const resetFileInput = () => {
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const validateFile = (file: File) => {
        if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
            return "Only jpeg, png, and webp images are allowed";
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            return "Image must be 5MB or smaller";
        }

        return null;
    };

    const handleUpload = async (file: File) => {
        const validationError = validateFile(file);

        if (validationError) {
            toast.error(validationError);
            resetFileInput();
            return;
        }

        setIsUploading(true);

        if (value.uploadId) {
            await deleteUploadAction(value.uploadId);
        }

        const formData = new FormData();
        formData.set("file", file);

        const result = await uploadImageAction({ success: false }, formData);
        setIsUploading(false);

        if (!result.success || !result.upload) {
            toast.error("Upload failed", {
                description: result.message,
            });
            resetFileInput();
            return;
        }

        onChange({
            ...value,
            uploadId: result.upload.id,
            previewUrl: result.upload.url,
        });

        toast.success("Image uploaded");
        resetFileInput();
    };

    const handleRemovePendingUpload = async () => {
        if (!value.uploadId) {
            return;
        }

        setIsDeleting(true);
        const result = await deleteUploadAction(value.uploadId);
        setIsDeleting(false);

        if (!result.success) {
            toast.error("Could not remove upload", {
                description: result.message,
            });
            return;
        }

        onChange({
            ...value,
            uploadId: null,
            previewUrl: null,
        });

        toast.success("Pending upload removed");
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                        {label}
                        {required ? " *" : ""}
                    </label>
                    {helpText ? (
                        <p className="mt-1 text-xs text-on-surface-variant">
                            {helpText}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-outline-variant/15 bg-surface-low">
                <div className="relative aspect-[4/3] w-full bg-surface-highest">
                    {displayUrl ? (
                        <Image
                            src={displayUrl}
                            alt={label}
                            fill
                            sizes="(max-width: 1024px) 100vw, 420px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-on-surface-variant">
                            <ImagePlus className="h-8 w-8 text-primary" />
                            <div>
                                <p className="font-bold text-on-surface">
                                    No image selected
                                </p>
                                <p className="text-xs">
                                    Upload `jpeg`, `png`, or `webp` up to 5MB.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 p-4">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={disabled || isUploading || isDeleting}
                        onChange={(event) => {
                            const file = event.target.files?.[0];

                            if (file) {
                                void handleUpload(file);
                            }
                        }}
                    />

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={disabled || isUploading || isDeleting}
                        onClick={() => inputRef.current?.click()}
                    >
                        {isUploading ? (
                            <>
                                <LoaderCircle className="animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <UploadCloud />
                                {displayUrl ? "Replace Image" : "Upload Image"}
                            </>
                        )}
                    </Button>

                    {value.uploadId ? (
                        <Button
                            type="button"
                            variant="outline"
                            disabled={disabled || isUploading || isDeleting}
                            onClick={() => void handleRemovePendingUpload()}
                        >
                            {isDeleting ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    Removing...
                                </>
                            ) : (
                                <>
                                    <Trash2 />
                                    Remove Pending Upload
                                </>
                            )}
                        </Button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
