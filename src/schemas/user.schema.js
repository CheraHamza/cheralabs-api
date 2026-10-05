import { z } from "zod";

export const updateUserSchema = z.object({
	body: z.object({
		name: z
			.string()
			.trim()
			.min(2, "Name must be at least 2 characters")
			.max(50, "Name cannot exceed 50 characters")
			.optional(),
		avatar: z.url("Avatar must be a valid URL").optional(),
	}),
});
