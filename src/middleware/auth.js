import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

export const requireAuth = (req, res, next) => {
	const token =
		req.cookies?.token ||
		(req.headers.authorization?.startsWith("Bearer ")
			? req.headers.authorization.split(" ")[1]
			: null);

	if (!token) {
		throw new AppError("Unauthorized: Missing token", 401);
	}

	try {
		const decoded = verifyToken(token);
		req.user = decoded;
		next();
	} catch (err) {
		throw new AppError("Unauthorized: Invalid or expired token", 401);
	}
};

export const requireAdmin = (req, res, next) => {
	if (!req.user) {
		throw new AppError("Unauthorized: Authentication required", 401);
	}

	if (req.user.role !== "ADMIN") {
		throw new AppError("Forbidden: Admin access required", 403);
	}

	next();
};
