import type { Category } from "@/types/product";

export interface CategoryTreeItem {
    category: Category;
    depth: number;
    path: string;
}

export function flattenCategoryTree(
    categories: Category[],
    depth = 0,
    parentPath?: string,
): CategoryTreeItem[] {
    return categories.flatMap((category) => {
        const path = parentPath ? `${parentPath} / ${category.name}` : category.name;

        return [
            { category, depth, path },
            ...flattenCategoryTree(category.children ?? [], depth + 1, path),
        ];
    });
}

export function findCategoryPath(
    categories: Category[],
    categoryId: string,
): string {
    for (const item of flattenCategoryTree(categories)) {
        if (item.category.id === categoryId) {
            return item.path;
        }
    }

    return "";
}

export function getCategoryDepth(
    categories: Category[],
    categoryId: string,
): number {
    for (const item of flattenCategoryTree(categories)) {
        if (item.category.id === categoryId) {
            return item.depth;
        }
    }

    return 0;
}

export function getDescendantIdsFromTree(categories: Category[], parentId: string) {
    const descendants = new Set<string>();

    const visit = (nodes: Category[]) => {
        for (const category of nodes) {
            if (category.id === parentId) {
                collect(category.children ?? []);
                return true;
            }

            if (visit(category.children ?? [])) {
                return true;
            }
        }

        return false;
    };

    const collect = (nodes: Category[]) => {
        for (const category of nodes) {
            descendants.add(category.id);
            collect(category.children ?? []);
        }
    };

    visit(categories);
    return descendants;
}
