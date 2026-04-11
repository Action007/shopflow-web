import { describe, expect, it } from "vitest";
import { buildQueryString, formatPrice } from "../utils";

describe("formatPrice", () => {
    it("formats string price with two decimals", () => {
        expect(formatPrice("29.99")).toBe("$29.99");
    });

    it("formats number price with thousands separator", () => {
        expect(formatPrice(1000)).toBe("$1,000.00");
    });

    it("formats zero", () => {
        expect(formatPrice("0")).toBe("$0.00");
    });

    it("formats price with many decimals", () => {
        expect(formatPrice("19.999")).toBe("$20.00");
    });

    it("handles negative prices", () => {
        expect(formatPrice("-5.50")).toBe("-$5.50");
    });
});

describe("buildQueryString", () => {
    it("builds query from params", () => {
        const result = buildQueryString({ page: "2", search: "laptop" });

        expect(result).toContain("page=2");
        expect(result).toContain("search=laptop");
        expect(result).toMatch(/^\?/);
    });

    it("filters undefined values", () => {
        const result = buildQueryString({ page: "1", search: undefined });

        expect(result).toContain("page=1");
        expect(result).not.toContain("search");
    });

    it("filters empty string values", () => {
        const result = buildQueryString({ page: "1", search: "" });

        expect(result).toContain("page=1");
        expect(result).not.toContain("search");
    });

    it("filters null values", () => {
        const result = buildQueryString({ page: "1", search: null });

        expect(result).toContain("page=1");
        expect(result).not.toContain("search");
    });

    it("returns empty string for no params", () => {
        expect(buildQueryString({})).toBe("");
    });
});
