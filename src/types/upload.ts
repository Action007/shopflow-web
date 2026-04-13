export interface UploadResource {
    id: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    status: "PENDING" | "USED";
    url: string;
}
