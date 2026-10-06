import express from "express";
import {
	getAllTags,
	getPostsByTag,
	createTag,
	updateTag,
	deleteTag,
} from "../controllers/tags.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
	createTagSchema,
	updateTagSchema,
	getTagPostsSchema,
	deleteTagSchema,
} from "../schemas/tag.schema.js";

const router = express.Router();

router.get("/", getAllTags);
router.get("/:slug/posts", validate(getTagPostsSchema), getPostsByTag); // Get all posts that have this tag

router.use(requireAuth, requireAdmin);
// Admin routes
router.post("/", validate(createTagSchema), createTag);
router.patch("/:id", validate(updateTagSchema), updateTag);
router.delete("/:id", validate(deleteTagSchema), deleteTag);

export default router;
