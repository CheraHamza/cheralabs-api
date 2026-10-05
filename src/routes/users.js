import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateUserSchema } from "../schemas/user.schema.js";
import {
	getUserProfile,
	updateUserProfile,
	deleteUserProfile,
} from "../controllers/users.js";

const router = express.Router();

router.use(requireAuth);

router.get("/me", getUserProfile);
router.patch("/me", validate(updateUserSchema), updateUserProfile);
router.delete("/me", deleteUserProfile);

export default router;
