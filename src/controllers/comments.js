import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

export const getPostComments = async (req, res, next) => {
	try {
		const { slug } = req.params;

		const post = await prisma.post.findUnique({
			where: { slug },
			select: { id: true, published: true },
		});

		if (!post || (!post.published && req.user?.role !== "Admin")) {
			return next(new AppError("Post not found", 404));
		}

		const comments = await prisma.comment.findMany({
			where: { postId: post.id },
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				content: true,
				createdAt: true,
				updatedAt: true,
				author: {
					select: { id: true, name: true, avatar: true },
				},
			},
		});

		return res.json({ success: true, count: comments.length, data: comments });
	} catch (error) {
		return next(error);
	}
};

export const createComment = async (req, res, next) => {
	try {
		const { slug } = req.params;
		const { content } = req.body;

		const post = await prisma.post.findUnique({
			where: { slug },
			select: { id: true, published: true },
		});

		if (!post) {
			return next(new AppError("Post not found", 404));
		}

		if (!post.published) {
			if (req.user.role !== "Admin") {
				return next(new AppError("Post not found", 404));
			} else {
				return next(new AppError("Post not published", 404));
			}
		}

		const comment = await prisma.comment.create({
			data: {
				content,
				postId: post.id,
				authorId: req.user.id,
			},
			select: {
				id: true,
				content: true,
				createdAt: true,
				author: {
					select: { id: true, name: true, avatar: true },
				},
			},
		});

		return res.status(201).json({
			success: true,
			message: "Comment posted successfully",
			data: comment,
		});
	} catch (error) {
		return next(error);
	}
};

export const updateComment = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { content } = req.body;

		const existingComment = await prisma.comment.findUnique({
			where: { id },
			select: { id: true, authorId: true },
		});

		if (!existingComment) {
			return next(new AppError("Comment not found", 404));
		}

		if (existingComment.authorId !== req.user.id) {
			return next(new AppError("You can only edit your own comments", 403));
		}

		const updatedComment = await prisma.comment.update({
			where: { id },
			data: { content },
			select: {
				id: true,
				content: true,
				updatedAt: true,
				author: {
					select: { id: true, name: true, avatar: true },
				},
			},
		});

		return res.json({
			success: true,
			message: "Comment updated successfully",
			data: updatedComment,
		});
	} catch (error) {
		return next(error);
	}
};

export const deleteComment = async (req, res, next) => {
	try {
		const { id } = req.params;

		const existingComment = await prisma.comment.findUnique({
			where: { id },
			select: { id: true, authorId: true },
		});

		if (!existingComment) {
			return next(new AppError("Comment not found", 404));
		}

		const isAuthor = existingComment.authorId === req.user.id;
		const isAdmin = req.user.role === "Admin";

		if (!isAuthor && !isAdmin) {
			return next(new AppError("Not authorized to delete this comment", 403));
		}

		await prisma.comment.delete({ where: { id } });

		return res.json({
			success: true,
			message: "Comment deleted successfully",
		});
	} catch (error) {
		return next(error);
	}
};
