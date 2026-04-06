import * as v from "valibot";
import { ERRORS } from "@/lib/constants/errors";

export const loginSchema = v.object({
    email: v.pipe(v.string(), v.email(ERRORS.VALIDATION.EMAIL.INVALID)),
    password: v.pipe(v.string(), v.minLength(6, ERRORS.VALIDATION.PASSWORD.MIN_6)),
});

export const registerSchema = v.pipe(
    v.object({
        firstName: v.pipe(v.string(), v.minLength(1, ERRORS.VALIDATION.FIRST_NAME.REQUIRED)),
        lastName: v.pipe(v.string(), v.minLength(1, ERRORS.VALIDATION.LAST_NAME.REQUIRED)),
        email: v.pipe(v.string(), v.email(ERRORS.VALIDATION.EMAIL.INVALID)),
        password: v.pipe(v.string(), v.minLength(8, ERRORS.VALIDATION.PASSWORD.MIN_8)),
        confirmPassword: v.string(),
    }),
    v.forward(
        v.partialCheck(
            [["password"], ["confirmPassword"]],
            (input) => input.password === input.confirmPassword,
            ERRORS.VALIDATION.PASSWORD.MISMATCH
        ),
        ["confirmPassword"]
    )
);

export type LoginInput = v.InferInput<typeof loginSchema>;
export type RegisterInput = v.InferInput<typeof registerSchema>;
