import express from "express";
import postsCommentsRouter from "./comments.js";
// import likesRouter from "./likes.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
	createPostSchema,
	updatePostSchema,
	getPostBySlugSchema,
} from "../schemas/post.schema.js";
import {
	getPublishedPosts,
	getPostBySlug,
	getAllPostsAdmin,
	getPostByIdAdmin,
	createPost,
	updatePost,
	deletePost,
} from "../controllers/posts.js";

const router = express.Router();

router.use("/:slug/comments", postsCommentsRouter);
// router.use("/:slug/likes", likesRouter);

// Public routes
router.get("/", getPublishedPosts);

// Admin routes
router.get("/admin/all", requireAuth, requireAdmin, getAllPostsAdmin); // Including unpublished posts
router.get("/admin/:id", requireAuth, requireAdmin, getPostByIdAdmin);
router.post(
	"/",
	requireAuth,
	requireAdmin,
	validate(createPostSchema),
	createPost,
);
router.patch(
	"/:id",
	requireAuth,
	requireAdmin,
	validate(updatePostSchema),
	updatePost,
);
router.delete("/:id", requireAuth, requireAdmin, deletePost);

// Public slug route
router.get("/:slug", validate(getPostBySlugSchema), getPostBySlug);

export default router;
