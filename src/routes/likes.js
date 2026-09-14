import express from "express";

const router = express.Router({ mergeParams: true });

// Mounted under /api/posts/:slug/likes in posts.js
router.post("/", likePost);
router.delete("/", unlikePost);

export default router;
