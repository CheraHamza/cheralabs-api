import { z } from "zod";

export const createTagSchema = z.object({
	body: z.object({
		name: z.string().min(2, "Tag must be at least 2 characters").max(30),
	}),
});

export const updateTagSchema = z.object({
	body: z.object({
		name: z.string().min(2, "Tag name must be at least 2 character").max(30),
	}),
	params: z.object({
		id: z.string().min(1, "Tag ID is required"),
	}),
});

export const getTagPostsSchema = z.object({
	params: z.object({
		slug: z.string().min(1, "Slug is required"),
	}),
});

export const deleteTagSchema = z.object({
	params: z.object({
		id: z.string().min(1, "Tag ID is required"),
	}),
});
