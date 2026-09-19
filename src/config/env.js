import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),

	PORT: z
		.string()
		.transform((val) => parseInt(val, 10))
		.default("3000"),

	DATABASE_URL: z
        .url("DATABASE_URL is required and must be a valid URL."),

	JWT_SECRET: z
		.string({ error: "JWT_SECRET is required" })
		.min(16, "JWT_SECRET must be at least 16 chars"),

	GOOGLE_CLIENT_ID: z
        .string({ error: "GOOGLE_CLIENT_ID is required" })
        .min(1),

	GOOGLE_CLIENT_SECRET: z
		.string({ error: "GOOGLE_CLIENT_SECRET is required" })
		.min(1),

	GITHUB_CLIENT_ID: z
        .string({ error: "GITHUB_CLIENT_ID is required" })
        .min(1),

	GITHUB_CLIENT_SECRET: z
		.string({ error: "GITHUB_CLIENT_SECRET is required" })
		.min(1),

	CLIENT_URL: z.url().default("http://localhost:5173"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error("❌ Invalid environment variables:");
	console.error(JSON.stringify(z.treeifyError(_env.error), null, 2));
	process.exit(1);
}

export const env = _env.data;
