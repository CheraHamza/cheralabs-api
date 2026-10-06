import { z } from "zod";

export const createCategorySchema = z.object({
	body: z.object({
		name: z
			.string()
			.min(2, "Category name must be at least 2 characters")
			.max(50),
	}),
});

export const updateCategorySchema = z.object({
	body: z.object({
		name: z.string().min(2).max(50).optional(),
	}),
	params: z.object({
		id: z.string().trim().min(1, "Category ID is required"),
	}),
});

export const getCategoryPostsSchema = z.object({
	params: z.object({
		slug: z.string().trim().min(1, "Slug is required"),
	}),
});

export const deleteCategorySchema = z.object({
	params: z.object({
		id: z.string().trim().min(1, "Category ID is required"),
	}),
});
