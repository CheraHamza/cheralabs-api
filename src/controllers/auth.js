import { signToken } from "../utils/jwt.js";
import { env } from "../config/env.js";

const ALLOWED_ORIGINS = ["http://localhost:5173"];

export const handleOAuthCallback = (req, res) => {
	const user = req.user;
	const token = signToken({ id: user.id, role: user.role });

	const targetOrigin = req.query.state;

	const redirectUrl = ALLOWED_ORIGINS.includes(targetOrigin)
		? targetOrigin
		: env.CLIENT_URL;

	res.cookie("token", token, {
		httpOnly: true,
		secure: env.NODE_ENV === "production",
		sameSite: env.NODE_ENV === "production" ? "none" : "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	return res.redirect(redirectUrl);
};

export const getCurrentUser = (req, res) => {
	return res.json({ user: req.user });
};

export const handleAuthFailure = (req, res) => {
	return res
		.status(401)
		.json({ message: "Authentication failed. Please try again." });
};

export const logoutUser = (req, res) => {
	res.clearCookie("token", {
		httpOnly: true,
		secure: env.NODE_ENV === "production",
		sameSite: env.NODE_ENV === "production" ? "none" : "lax",
	});

	return res.json({ message: "Logged out successfully" });
};
