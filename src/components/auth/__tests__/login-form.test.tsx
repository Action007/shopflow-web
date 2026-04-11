import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { useActionStateMock } = vi.hoisted(() => ({
    useActionStateMock: vi.fn(),
}));

vi.mock("react", async () => {
    const actual = await vi.importActual<typeof import("react")>("react");

    return {
        ...actual,
        useActionState: useActionStateMock,
    };
});

vi.mock("next/link", () => ({
    default: ({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) => <a href={href}>{children}</a>,
}));

vi.mock("@/components/auth/auth-shell", () => ({
    AuthShell: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

vi.mock("@/actions/auth", () => ({
    loginAction: vi.fn(),
}));

import { LoginForm } from "../login-form";

describe("LoginForm", () => {
    it("renders callback-aware register link", () => {
        useActionStateMock.mockReturnValue([
            { success: false },
            vi.fn(),
            false,
        ]);

        render(<LoginForm callbackUrl="/checkout" />);

        expect(screen.getByDisplayValue("/checkout")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute(
            "href",
            "/register?callbackUrl=%2Fcheckout",
        );
    });

    it("renders action error and field errors", () => {
        useActionStateMock.mockReturnValue([
            {
                success: false,
                message: "Invalid email or password",
                fieldErrors: {
                    email: ["Invalid email"],
                    password: ["Password required"],
                },
            },
            vi.fn(),
            false,
        ]);

        render(<LoginForm />);

        expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
        expect(screen.getByText("Invalid email")).toBeInTheDocument();
        expect(screen.getByText("Password required")).toBeInTheDocument();
    });

    it("shows pending submit state", () => {
        useActionStateMock.mockReturnValue([
            { success: false },
            vi.fn(),
            true,
        ]);

        render(<LoginForm />);

        expect(
            screen.getByRole("button", { name: "Logging In..." }),
        ).toBeDisabled();
    });

    it("submits through the action returned by useActionState", () => {
        const formAction = vi.fn();
        useActionStateMock.mockReturnValue([
            { success: false },
            formAction,
            false,
        ]);

        const { container } = render(<LoginForm />);

        fireEvent.submit(container.querySelector("form")!);

        expect(formAction).toHaveBeenCalledTimes(1);
    });
});
