import express from "express";
import commentsRouter from "./comments.js";
import likesRouter from "./likes.js";

const router = express.Router();

router.use("/:slug/comments", commentsRouter);
router.use("/:slug/likes", likesRouter);

// Public routes
router.get("/", getPublishedPosts);
router.get("/:slug", getPostBySlug);

router.use(requireAuth, requireAdmin);
// Admin routes
router.get("/admin", getAllPostsAdmin); // Including unpublished posts
router.get("/:id", getPostByIdAdmin);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
