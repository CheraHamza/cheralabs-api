import express from "express";

// allows capturing params from the parent route
const router = express.Router({ mergeParams: true });

// Mounted under /api/posts/:slug/comments in posts.js
router.get("/", getPostComments);

router.use(requireAuth);

router.post("/", postComment);
// Mounted under /api/comments for direct access
router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
