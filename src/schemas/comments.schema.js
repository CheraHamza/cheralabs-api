import { z } from "zod";

export const getPostCommentsSchema = z.object({
	params: z.object({
		slug: z.string().min(1, "Post slug is required"),
	}),
});

export const createCommentSchema = z.object({
	params: z.object({
		slug: z.string().min(1, "Post slug is required"),
	}),
	body: z.object({
		content: z
			.string()
			.min(1, "Comment cannot be empty")
			.max(1000, "Comment too long"),
	}),
});

export const updateCommentSchema = z.object({
	params: z.object({
		id: z.string().min(1, "Comment ID is required"),
	}),
	body: z.object({
		content: z
			.string()
			.min(1, "Comment cannot be empty")
			.max(1000, "Comment too long"),
	}),
});

export const deleteCommentSchema = z.object({
	params: z.object({
		id: z.string().min(1, "Comment ID is required"),
	}),
});
