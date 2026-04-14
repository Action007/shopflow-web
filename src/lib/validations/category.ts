import * as v from "valibot";

const categoryNameSchema = v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "Category name is required"),
);

const categoryDescriptionSchema = v.optional(
    v.pipe(v.string(), v.trim()),
);

const categoryParentSchema = v.optional(
    v.union([v.string(), v.null()]),
);

export const createCategorySchema = v.object({
    name: categoryNameSchema,
    description: categoryDescriptionSchema,
    parentId: categoryParentSchema,
});

export const updateCategorySchema = v.object({
    name: categoryNameSchema,
    description: categoryDescriptionSchema,
    parentId: categoryParentSchema,
});

export type CreateCategoryFormValues = v.InferInput<
    typeof createCategorySchema
>;
export type UpdateCategoryFormValues = v.InferInput<
    typeof updateCategorySchema
>;
