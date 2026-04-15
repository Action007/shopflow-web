"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { updateProfileAction } from "@/actions/user";
import {
    ImageUploadField,
    type ImageUploadValue,
} from "@/components/shared/image-upload-field";
import { ExpandableFormShell } from "@/components/shared/expandable-form-shell";
import { Button } from "@/components/ui/button";
import { ERRORS } from "@/lib/constants/errors";
import { cleanupPendingUpload } from "@/lib/upload-client";
import {
    updateProfileSchema,
    type UpdateProfileFormValues,
} from "@/lib/validations/user";
import type { User } from "@/types/user";

interface ProfileSettingsFormProps {
    user: User;
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);
    const handledUploadIdsRef = useRef(new Set<string>());
    const [uploadValue, setUploadValue] = useState<ImageUploadValue>({
        uploadId: null,
        previewUrl: null,
        existingUrl: user.profileImageUrl ?? null,
    });

    useEffect(() => {
        const uploadId = uploadValue.uploadId;

        return () => {
            if (!uploadId || handledUploadIdsRef.current.has(uploadId)) {
                return;
            }

            void cleanupPendingUpload(uploadId);
        };
    }, [uploadValue.uploadId]);

    const form = useForm<UpdateProfileFormValues>({
        resolver: valibotResolver(updateProfileSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            imageUploadId: "",
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = form;

    const onSubmit = handleSubmit((values) => {
        setServerError(null);

        startTransition(async () => {
            const result = await updateProfileAction(user.id, {
                ...values,
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                imageUploadId: uploadValue.uploadId ?? undefined,
            });

            if (!result.success) {
                setServerError(result.message ?? ERRORS.PROFILE.UPDATE_FAILED);

                if (result.fieldErrors) {
                    for (const [field, messages] of Object.entries(
                        result.fieldErrors,
                    )) {
                        if (messages?.[0]) {
                            form.setError(field as keyof UpdateProfileFormValues, {
                                message: messages[0],
                            });
                        }
                    }
                }

                toast.error(ERRORS.PROFILE.UPDATE_FAILED, {
                    description: result.message,
                });
                return;
            }

            if (uploadValue.uploadId) {
                handledUploadIdsRef.current.add(uploadValue.uploadId);
            }

            setUploadValue((current) => ({
                uploadId: null,
                previewUrl: null,
                existingUrl: current.previewUrl ?? current.existingUrl ?? null,
            }));
            toast.success(ERRORS.PROFILE.UPDATE_SUCCESS);
            router.refresh();
        });
    });

    return (
        <form onSubmit={onSubmit}>
            <ExpandableFormShell
                eyebrow="Profile Settings"
                title="Update your account details"
                description="Edit your name and profile image without opening the full form by default."
                defaultExpanded={false}
            >
                <ImageUploadField
                    label="Profile Image"
                    helpText={ERRORS.PROFILE.IMAGE_HELP}
                    value={uploadValue}
                    disabled={isPending}
                    onChange={(nextValue) => {
                        setUploadValue(nextValue);
                        setValue("imageUploadId", nextValue.uploadId ?? "", {
                            shouldValidate: true,
                        });
                    }}
                    onPendingUploadHandled={(uploadId) => {
                        handledUploadIdsRef.current.add(uploadId);
                    }}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="First Name" error={errors.firstName?.message}>
                        <input
                            className="h-12 w-full rounded-lg border-b-2 border-transparent bg-surface-highest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-300 ease-fluid placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25"
                            {...register("firstName")}
                        />
                    </Field>

                    <Field label="Last Name" error={errors.lastName?.message}>
                        <input
                            className="h-12 w-full rounded-lg border-b-2 border-transparent bg-surface-highest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-300 ease-fluid placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25"
                            {...register("lastName")}
                        />
                    </Field>
                </div>

                <Field label="Email">
                    <div className="flex min-h-12 items-center rounded-lg border border-outline-variant/15 bg-surface-highest px-4 text-sm text-on-surface-variant">
                        {user.email}
                    </div>
                    <p className="text-[10px] font-medium text-on-surface-variant">
                        Email changes are not available from this form.
                    </p>
                </Field>

                {serverError ? (
                    <p className="text-sm text-destructive">{serverError}</p>
                ) : null}

                <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={isPending}>
                        <Save />
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </ExpandableFormShell>
        </form>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                {label}
            </label>
            {children}
            {error ? (
                <p className="text-[10px] font-medium text-destructive">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
