import { z } from "zod";

export const toggleLikeSchema = z.object({
	params: z.object({
		slug: z.string().min(1, "Post slug is required"),
	}),
});

export const getPostLikesSchema = z.object({
	params: z.object({
		slug: z.string().min(1, "Post slug is required"),
	}),
});
