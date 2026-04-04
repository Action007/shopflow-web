import { z } from "zod";
import { ERRORS } from "@/lib/constants/errors";

export const loginSchema = z.object({
    email: z.email(ERRORS.VALIDATION.EMAIL.INVALID),
    password: z.string().min(6, ERRORS.VALIDATION.PASSWORD.MIN_6),
});

export const registerSchema = z
    .object({
        firstName: z.string().min(1, ERRORS.VALIDATION.FIRST_NAME.REQUIRED),
        lastName: z.string().min(1, ERRORS.VALIDATION.LAST_NAME.REQUIRED),
        email: z.email(ERRORS.VALIDATION.EMAIL.INVALID),
        password: z.string().min(8, ERRORS.VALIDATION.PASSWORD.MIN_8),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: ERRORS.VALIDATION.PASSWORD.MISMATCH,
        path: ["confirmPassword"],
    });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
