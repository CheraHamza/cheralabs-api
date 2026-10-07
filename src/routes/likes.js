import express from "express";
import {
	toggleLike,
	getPostLikes,
	getPostLikesAnalytics,
} from "../controllers/like.js";
import { validate } from "../middleware/validate.js";
import { optionalAuth, requireAdmin } from "../middleware/auth.js";
import {
	toggleLikeSchema,
	getPostLikesSchema,
} from "../schemas/like.schema.js";

const router = express.Router({ mergeParams: true });

// Mounted under /api/posts/:slug/likes in posts.js
router.post("/", validate(getPostLikesSchema), getPostLikes);

router.post("/toggle", optionalAuth, validate(toggleLikeSchema), toggleLike);

router.get("/analytics", requireAdmin, getPostLikesAnalytics);

export default router;
