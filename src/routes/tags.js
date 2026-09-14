import express from "express";

const router = express.Router();

router.get("/", getAllTags);
router.get("/:slug/posts", getPostsByTag); // Get all posts that have this tag

router.use(requireAuth, requireAdmin);
// Admin routes
router.post("/", createTag);
router.patch("/:id", updateTag);
router.delete("/:id", deleteTag);

export default router;
