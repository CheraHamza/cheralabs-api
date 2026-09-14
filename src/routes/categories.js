import express from "express";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:slug/posts", getPostsByCategory); // Get all posts belonging to a specific category

router.use(requireAuth, requireAdmin);

// Admin routes
router.post("/", createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
