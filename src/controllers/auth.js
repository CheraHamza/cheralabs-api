import { signToken } from "../utils/jwt.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const ALLOWED_ORIGINS = ["http://localhost:5173"];

export const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: env.NODE_ENV === "production",
	sameSite: env.NODE_ENV === "production" ? "none" : "lax",
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const handleOAuthCallback = (req, res) => {
	const user = req.user;

	if (!user) {
		return next(new AppError("Authentication failed: No user found", 401));
	}

	const token = signToken({ id: user.id, role: user.role });

	const targetOrigin = req.query.state;

	const redirectUrl = ALLOWED_ORIGINS.includes(targetOrigin)
		? targetOrigin
		: env.CLIENT_URL;

	res.cookie("token", token, COOKIE_OPTIONS);

	return res.redirect(redirectUrl);
};

export const getCurrentUser = (req, res) => {
	return res.json({ user: req.user });
};

export const handleAuthFailure = (req, res, next) => {
	return next(new AppError("Authentication failed. Please try again.", 401));
};

export const logoutUser = (req, res) => {
	res.clearCookie("token", COOKIE_OPTIONS);

	return res.json({ message: "Logged out successfully" });
};
