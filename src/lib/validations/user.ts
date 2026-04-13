import * as v from "valibot";
import { ERRORS } from "@/lib/constants/errors";

export const updateProfileSchema = v.object({
    firstName: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, ERRORS.VALIDATION.FIRST_NAME.REQUIRED),
    ),
    lastName: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, ERRORS.VALIDATION.LAST_NAME.REQUIRED),
    ),
    email: v.pipe(v.string(), v.trim(), v.email(ERRORS.VALIDATION.EMAIL.INVALID)),
    imageUploadId: v.optional(v.string()),
});

export type UpdateProfileFormValues = v.InferInput<typeof updateProfileSchema>;
