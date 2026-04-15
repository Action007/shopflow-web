import { NextResponse } from "next/server";
import { ApiClientError } from "@/lib/api";
import { apiAuthDelete } from "@/lib/api-auth";
import { API_ROUTES } from "@/lib/constants/routes";

export async function DELETE(
    _request: Request,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;

    try {
        await apiAuthDelete<void>(API_ROUTES.UPLOADS.DETAIL(id), {
            redirectOn401: false,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof ApiClientError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: error.statusCode },
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete upload",
            },
            { status: 500 },
        );
    }
}
