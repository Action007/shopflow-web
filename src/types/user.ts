export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl?: string | null;
    role: "CUSTOMER" | "ADMIN";
    createdAt: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    imageUploadId?: string;
}
