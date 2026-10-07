import express from "express";
import authRouter from "./auth.js";
import postsRouter from "./posts.js";
import directCommentsRouter from "./directComments.js";
import categoriesRouter from "./categories.js";
import tagsRouter from "./tags.js";
import usersRouter from "./users.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/posts", postsRouter);
router.use("/comments", directCommentsRouter);
router.use("/categories", categoriesRouter);
router.use("/tags", tagsRouter);
router.use("/users", usersRouter);

export default router;
