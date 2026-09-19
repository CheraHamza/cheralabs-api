import express from "express";
import passport from "../config/passport.js";
import {
	handleOAuthCallback,
	getCurrentUser,
	handleAuthFailure,
	logoutUser,
} from "../controllers/auth.js";
import { requireAuth } from "../middleware/auth.js";
import { env } from "../config/env.js";

const router = express.Router();

router.get("/google", (req, res, next) => {
	const redirectTo = req.query.redirect_to || env.CLIENT_URL;

	passport.authenticate("google", {
		scope: ["profile", "email"],
		session: false,
		state: redirectTo,
	})(req, res, next);
});

router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/api/auth/failure",
		session: false,
	}),
	handleOAuthCallback,
);

router.get("/github", (req, res, next) => {
	const redirectTo = req.query.redirect_to || env.CLIENT_URL;

	passport.authenticate("github", {
		scope: ["user:email"],
		session: false,
		state: redirectTo,
	})(req, res, next);
});

router.get(
	"/github/callback",
	passport.authenticate("github", {
		failureRedirect: "/api/auth/failure",
		session: false,
	}),
	handleOAuthCallback,
);

router.get("/me", requireAuth, getCurrentUser);
router.post("/logout", logoutUser);
router.get("/failure", handleAuthFailure);

export default router;
