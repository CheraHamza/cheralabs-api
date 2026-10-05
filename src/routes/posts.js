import express from "express";
// import commentsRouter from "./comments.js";
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

// router.use("/:slug/comments", commentsRouter);
// router.use("/:slug/likes", likesRouter);

// Public routes
router.get("/", getPublishedPosts);
router.get("/:slug", validate(getPostBySlugSchema), getPostBySlug);

router.use(requireAuth, requireAdmin);
// Admin routes
router.get("/admin", getAllPostsAdmin); // Including unpublished posts
router.get("/:id", getPostByIdAdmin);
router.post("/", validate(createPostSchema), createPost);
router.patch("/:id", validate(updatePostSchema), updatePost);
router.delete("/:id", deletePost);

export default router;
