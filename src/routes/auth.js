import express from "express";

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

router.get("/github", githubAuth);
router.get("/github/callback", githubAuthCallback);

router.get("/me", requireAuth, getCurrentUser);
router.post("/logout", logoutUser);


export default router;
