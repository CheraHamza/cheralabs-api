import express from "express";
import {
	getAllCategories,
	getPostsByCategory,
	createCategory,
	updateCategory,
	deleteCategory,
} from "../controllers/categories.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
	createCategorySchema,
	updateCategorySchema,
	getCategoryPostsSchema,
	deleteCategorySchema,
} from "../schemas/category.schema.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get(
	"/:slug/posts",
	validate(getCategoryPostsSchema),
	getPostsByCategory,
); // Get all posts belonging to a specific category

router.use(requireAuth, requireAdmin);

// Admin routes
router.post("/", validate(createCategorySchema), createCategory);
router.patch("/:id", validate(updateCategorySchema), updateCategory);
router.delete("/:id", validate(deleteCategorySchema), deleteCategory);

export default router;
