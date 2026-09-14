import express from "express";

const router = express.Router();

router.use(requireAuth);

router.get("/me", getUserProfile);
router.patch("/me", updateUserProfile);
router.delete("/me", deleteUserProfile);

export default router;
