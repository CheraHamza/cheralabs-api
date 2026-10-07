import express from "express";
import { getPostComments, createComment } from "../controllers/comments.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
	createCommentSchema,
	getPostCommentsSchema,
} from "../schemas/comments.schema.js";

// allows capturing params from the parent route
const router = express.Router({ mergeParams: true });

// Mounted under /api/posts/:slug/comments in posts.js
router.get("/", validate(getPostCommentsSchema), getPostComments);

router.post("/", requireAuth, validate(createCommentSchema), createComment);

export default router;
