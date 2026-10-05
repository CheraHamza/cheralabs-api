import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
	if (env.NODE_ENV === "development") {
		console.error("[Error Log]:", err);
	}

	// Validation Errors
	if (err instanceof ZodError) {
		const formattedErrors = err.errors.reduce((acc, issue) => {
			const path = issue.path.join(".").replace(/^(body|query|params)\./, "");
			acc[path] = issue.message;
			return acc;
		}, {});

		return res.status(400).json({
			success: false,
			message: "Validation failed",
			errors: formattedErrors,
		});
	}

	// Custom Operational API Errors
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
	}

	// Prisma Database Errors
	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		if (err.code === "P2002") {
			const target = err.meta?.target || ["field"];
			return res.status(409).json({
				success: false,
				message: `A record with this ${target.join(", ")} already exists.`,
			});
		}

		if (err.code === "P2025") {
			return res.status(404).json({
				success: false,
				message: "Requested record was not found.",
			});
		}

		if (err.code === "P2003") {
			return res.status(400).json({
				success: false,
				message: "Invalid reference ID provided.",
			});
		}
	}

	// Prisma Schema / Payload Validation Failure
	if (err instanceof Prisma.PrismaClientValidationError) {
		return res.status(400).json({
			success: false,
			message: "Invalid database query parameters or payload structure.",
		});
	}

	// JWT Errors
	if (err.name === "JsonWebTokenError") {
		return res.status(401).json({
			success: false,
			message: "Invalid token, Please log in again.",
		});
	}

	if (err.name === "TokenExpiredError") {
		return res.status(401).json({
			sucess: false,
			message: "Your token has expired. Please log in again.",
		});
	}

	const statusCode =
		err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;

	return res.status(statusCode).json({
		success: false,
		message:
			env.NODE_ENV === "production"
				? "An unexpected error occured on the server."
				: err.message,
		...(env.NODE_ENV === "development" && { stack: err.stack }),
	});
};
