"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";
import { updateProfileAction } from "@/actions/user";
import {
    ImageUploadField,
    type ImageUploadValue,
} from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { ERRORS } from "@/lib/constants/errors";
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
    const [uploadValue, setUploadValue] = useState<ImageUploadValue>({
        uploadId: null,
        previewUrl: null,
        existingUrl: user.profileImageUrl ?? null,
    });

    const form = useForm<UpdateProfileFormValues>({
        resolver: valibotResolver(updateProfileSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            imageUploadId: "",
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = form;

    const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`;
    const displayAvatar = uploadValue.previewUrl ?? uploadValue.existingUrl ?? null;

    const onSubmit = handleSubmit((values) => {
        setServerError(null);

        startTransition(async () => {
            const result = await updateProfileAction(user.id, {
                ...values,
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                email: values.email.trim(),
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

            toast.success(ERRORS.PROFILE.UPDATE_SUCCESS);
            router.refresh();
        });
    });

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-5 rounded-[28px] bg-surface-low p-6 shadow-[0_0_60px_rgba(229,225,228,0.04)]"
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                        Profile Settings
                    </p>
                    <h2 className="mt-2 font-headline text-2xl font-black tracking-[-0.03em] text-on-surface">
                        Update your account details
                    </h2>
                </div>

                <div className="flex items-center gap-4 rounded-full border border-outline-variant/15 bg-surface-high px-4 py-3">
                    <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-black text-primary">
                        {displayAvatar ? (
                            <Image
                                src={displayAvatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                fill
                                sizes="56px"
                                className="object-cover"
                            />
                        ) : (
                            initials
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                            Profile Image
                        </p>
                        <p className="mt-1 text-sm text-on-surface">
                            Add or replace your avatar.
                        </p>
                    </div>
                    <Camera className="hidden h-4 w-4 text-primary sm:block" />
                </div>
            </div>

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

            {serverError ? (
                <p className="text-sm text-destructive">{serverError}</p>
            ) : null}

            <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isPending}>
                    <Save />
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
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
