import express from "express";
import postsRouter from "./posts.js";
import commentsRouter from "./comments.js";
import categoriesRouter from "./categories.js";
import tagsRouter from "./tags.js";
import usersRouter from "./users.js";

const router = express.Router();

router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);
router.use("/categories", categoriesRouter);
router.use("/tags", tagsRouter);
router.use("/users", usersRouter);

export default router;
