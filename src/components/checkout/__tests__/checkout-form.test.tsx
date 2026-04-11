import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ERRORS } from "@/lib/constants/errors";

const { placeOrderActionMock, toastErrorMock } = vi.hoisted(() => ({
    placeOrderActionMock: vi.fn(),
    toastErrorMock: vi.fn(),
}));

vi.mock("@/actions/order", () => ({
    placeOrderAction: placeOrderActionMock,
}));

vi.mock("sonner", () => ({
    toast: {
        error: toastErrorMock,
    },
}));

import { CheckoutForm } from "../checkout-form";

describe("CheckoutForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows validation errors for invalid input", async () => {
        render(<CheckoutForm />);

        fireEvent.click(screen.getAllByRole("button", { name: "Place Order" })[0]);

        await waitFor(() => {
            expect(
                screen.getByText(ERRORS.CHECKOUT.SHIPPING_ADDRESS_INVALID),
            ).toBeInTheDocument();
        });
        expect(screen.getByText(ERRORS.CHECKOUT.CITY_REQUIRED)).toBeInTheDocument();
        expect(screen.getByText(ERRORS.CHECKOUT.STATE_REQUIRED)).toBeInTheDocument();
        expect(screen.getByText(ERRORS.CHECKOUT.ZIP_CODE_INVALID)).toBeInTheDocument();
        expect(screen.getByText(ERRORS.CHECKOUT.PHONE_INVALID)).toBeInTheDocument();
        expect(placeOrderActionMock).not.toHaveBeenCalled();
    });

    it("submits valid form data to placeOrderAction", async () => {
        placeOrderActionMock.mockResolvedValueOnce({ success: true });

        render(<CheckoutForm />);

        fireEvent.change(screen.getByPlaceholderText("123 Digital Obsidian Way"), {
            target: { value: "123 Digital Obsidian Way" },
        });
        fireEvent.change(screen.getByPlaceholderText("Neo Tokyo"), {
            target: { value: "Neo Tokyo" },
        });
        fireEvent.change(screen.getByPlaceholderText("Kanto"), {
            target: { value: "Kanto" },
        });
        fireEvent.change(screen.getByPlaceholderText("100-0001"), {
            target: { value: "1000001" },
        });
        fireEvent.change(screen.getByPlaceholderText("+81 90-0000"), {
            target: { value: "1234567890" },
        });

        fireEvent.click(screen.getAllByRole("button", { name: "Place Order" })[0]);

        await waitFor(() => {
            expect(placeOrderActionMock).toHaveBeenCalledWith({
                shippingAddress: "123 Digital Obsidian Way",
                city: "Neo Tokyo",
                state: "Kanto",
                zipCode: "1000001",
                phone: "1234567890",
            });
        });
    });

    it("shows server error and toast when place order fails", async () => {
        placeOrderActionMock.mockResolvedValueOnce({
            success: false,
            message: "Inventory changed",
        });

        render(<CheckoutForm />);

        fireEvent.change(screen.getByPlaceholderText("123 Digital Obsidian Way"), {
            target: { value: "123 Digital Obsidian Way" },
        });
        fireEvent.change(screen.getByPlaceholderText("Neo Tokyo"), {
            target: { value: "Neo Tokyo" },
        });
        fireEvent.change(screen.getByPlaceholderText("Kanto"), {
            target: { value: "Kanto" },
        });
        fireEvent.change(screen.getByPlaceholderText("100-0001"), {
            target: { value: "1000001" },
        });
        fireEvent.change(screen.getByPlaceholderText("+81 90-0000"), {
            target: { value: "1234567890" },
        });

        fireEvent.click(screen.getAllByRole("button", { name: "Place Order" })[0]);

        await waitFor(() => {
            expect(screen.getByText("Inventory changed")).toBeInTheDocument();
        });
        expect(toastErrorMock).toHaveBeenCalledWith(
            ERRORS.ORDER.PLACE_FAILED,
            { description: "Inventory changed" },
        );
    });
});
