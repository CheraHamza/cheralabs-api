import express from "express";
import { updateComment, deleteComment } from "../controllers/comments.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
	updateCommentSchema,
	deleteCommentSchema,
} from "../schemas/comments.schema.js";

const router = express.Router();

router.use(requireAuth);

router.patch("/:id", validate(updateCommentSchema), updateComment);

router.delete("/:id", validate(deleteCommentSchema), deleteComment);

export default router;
