"use server";

import { apiAuthDelete, apiAuthPostForm } from "@/lib/api-auth";
import { ApiClientError } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants/routes";
import type { UploadResource } from "@/types/upload";

export interface UploadActionResult {
    success: boolean;
    upload?: UploadResource;
    message?: string;
}

export async function uploadImageAction(
    _prevState: UploadActionResult,
    formData: FormData,
): Promise<UploadActionResult> {
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
        return {
            success: false,
            message: "Image file is required",
        };
    }

    const payload = new FormData();
    payload.set("file", file);

    try {
        const upload = await apiAuthPostForm<UploadResource>(
            API_ROUTES.UPLOADS.IMAGES,
            payload,
            { redirectOn401: false },
        );

        return { success: true, upload };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: false,
            message: "Image upload failed",
        };
    }
}

export async function deleteUploadAction(
    uploadId: string,
): Promise<{ success: boolean; message?: string }> {
    try {
        await apiAuthDelete<void>(API_ROUTES.UPLOADS.DETAIL(uploadId), {
            redirectOn401: false,
        });

        return { success: true };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: false,
            message: "Failed to delete upload",
        };
    }
}
