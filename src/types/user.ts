export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "CUSTOMER" | "ADMIN";
    createdAt: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}
