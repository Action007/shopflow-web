export async function cleanupPendingUpload(uploadId: string) {
    try {
        await fetch(`/api/uploads/${uploadId}`, {
            method: "DELETE",
            credentials: "same-origin",
            keepalive: true,
        });
    } catch {
        // Ignore cleanup failures because the upload may have already been consumed.
    }
}
