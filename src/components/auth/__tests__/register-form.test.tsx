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
    AuthShell: ({
        children,
        footer,
    }: {
        children: React.ReactNode;
        footer?: React.ReactNode;
    }) => (
        <div>
            {children}
            {footer}
        </div>
    ),
}));

vi.mock("@/actions/auth", () => ({
    registerAction: vi.fn(),
}));

import { RegisterForm } from "../register-form";

describe("RegisterForm", () => {
    it("renders callback-aware login link", () => {
        useActionStateMock.mockReturnValue([
            { success: false },
            vi.fn(),
            false,
        ]);

        render(<RegisterForm callbackUrl="/checkout" />);

        expect(screen.getByDisplayValue("/checkout")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
            "href",
            "/login?callbackUrl=%2Fcheckout",
        );
    });

    it("toggles password visibility", () => {
        useActionStateMock.mockReturnValue([
            { success: false },
            vi.fn(),
            false,
        ]);

        render(<RegisterForm />);

        const passwordInput = screen.getAllByPlaceholderText("••••••••")[0];

        expect(passwordInput).toHaveAttribute("type", "password");
        fireEvent.click(screen.getAllByRole("button")[0]);
        expect(passwordInput).toHaveAttribute("type", "text");
    });

    it("renders field and form errors", () => {
        useActionStateMock.mockReturnValue([
            {
                success: false,
                message: "Something went wrong",
                fieldErrors: {
                    firstName: ["First name is required"],
                    email: ["Invalid email address"],
                },
            },
            vi.fn(),
            false,
        ]);

        render(<RegisterForm />);

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        expect(screen.getByText("First name is required")).toBeInTheDocument();
        expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });

    it("shows pending submit state", () => {
        useActionStateMock.mockReturnValue([
            { success: false },
            vi.fn(),
            true,
        ]);

        render(<RegisterForm />);

        expect(
            screen.getByRole("button", { name: "Creating Account..." }),
        ).toBeDisabled();
    });

    it("submits through the action returned by useActionState", () => {
        const formAction = vi.fn();
        useActionStateMock.mockReturnValue([
            { success: false },
            formAction,
            false,
        ]);

        const { container } = render(<RegisterForm />);

        fireEvent.submit(container.querySelector("form")!);

        expect(formAction).toHaveBeenCalledTimes(1);
    });
});
