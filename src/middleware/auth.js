import { verifyToken } from "../utils/jwt.js";

export const requireAuth = (req, res, next) => {
	const token =
		req.cookies?.token ||
		(req.headers.authorization?.startsWith("Bearer ")
			? req.headers.authorization.split(" ")[1]
			: null);

	if (!token) {
		return res
			.status(401)
			.json({ message: "Unauthorized: Authentication required" });
	}

	try {
		const decoded = verifyToken(token);
		req.user = decoded;
		next();
	} catch (err) {
		return res
			.status(401)
			.json({ message: "Unauthorized: Invalid or expired token" });
	}
};

export const requireAdmin = (req, res, next) => {
	if (!req.user) {
		return res
			.status(401)
			.json({ message: "Unauthorized: Authentication required" });
	}

	if (req.user.role !== "ADMIN") {
		return res
			.status(403)
			.json({ message: "Forbidden: Admin access required" });
	}

	next();
};
