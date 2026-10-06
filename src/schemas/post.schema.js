import { z } from "zod";

export const createPostSchema = z.object({
	body: z.object({
		title: z
			.string()
			.trim()
			.min(3, "Title must be at least 3 characters")
			.max(150, "Title cannot exceed 150 characters"),
		content: z
			.string()
			.trim()
			.min(10, "Content must be at least 10 characters"),
		published: z.boolean().optional().default(false),
		categoryId: z.string().optional(),
		tagIds: z.array(z.string().min(1, "Tag ID is required")).optional(),
	}),
});

export const updatePostSchema = z.object({
	params: z.object({
		id: z.string().trim().min(1, "Post ID is required"),
	}),
	body: z.object({
		title: z
			.string()
			.trim()
			.min(3, "Title must be at least 3 characters")
			.max(150, "Title cannot exceed 150 characters")
			.optional(),
		content: z
			.string()
			.trim()
			.min(10, "Content must be at least 10 characters")
			.optional(),
		published: z.boolean().optional(),
		categoryId: z.string().nullable().optional(),
		tagIds: z
			.array(z.string().min(1, "Tag ID is required"))
			.nullable()
			.optional(),
	}),
});

export const getPostBySlugSchema = z.object({
	params: z.object({
		slug: z.string().trim().min(1, "Slug is required"),
	}),
});
