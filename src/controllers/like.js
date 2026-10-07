import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { getClientIdentifier } from "../utils/identifier.js";

export const toggleLike = async (req, res, next) => {
	try {
		const { slug } = req.params;
		const identifier = getClientIdentifier(req);
		const userId = req.user?.id || null;

		const post = await prisma.post.findUnique({
			where: { slug },
			select: { id: true, published: true },
		});

		if (!post || (!post.published && req.user.role !== "Admin")) {
			return next(new AppError("Post not found", 404));
		}

		const result = await prisma.$transaction(async (tx) => {
			const existingLike = await tx.like.findUnique({
				where: {
					identifier_postId: {
						identifier,
						postId: post.id,
					},
				},
			});

			if (existingLike) {
				await tx.like.delete({
					where: {
						identifier_postId: {
							identifier,
							postId: post.id,
						},
					},
				});
				return { liked: false };
			} else {
				await tx.like.create({
					data: {
						identifier,
						postId: post.id,
						userId,
					},
				});
				return { liked: true };
			}
		});

		const totalLikes = await prisma.like.count({
			where: { postId: post.id },
		});

		return res.json({
			success: true,
			message: result.liked ? "Post liked" : "Post unliked",
			data: {
				liked: result.liked,
				totalLikes,
			},
		});
	} catch (error) {
		return next(error);
	}
};

export const getPostLikes = async (req, res, next) => {
	try {
		const { slug } = req.params;
		const identifier = getClientIdentifier(req);

		const post = await prisma.post.findUnique({
			where: { slug },
			select: { id: true, published: true },
		});

		if (!post || (!post.published && req.user.role !== "Admin")) {
			return next(new AppError("Post not found", 404));
		}

		const [totalLikes, existingLike] = await Promise.all([
			prisma.like.count({
				where: { postId: post.id },
			}),
			prisma.like.findUnique({
				where: {
					identifier_postId: {
						identifier,
						postId: post.id,
					},
				},
				select: { id: true },
			}),
		]);

		return res.json({
			success: true,
			data: {
				totalLikes,
				hasLiked: existingLike,
			},
		});
	} catch (error) {
		return next(error);
	}
};

export const getPostLikesAnalytics = async (req, res, next) => {
	try {
		const { slug } = req.params;

		const post = await prisma.post.findUnique({
			where: { slug },
			select: { id: true },
		});

		if (!post) {
			return next(new AppError("Post not found", 404));
		}

		const likes = await prisma.like.findMany({
			where: { postId: post.id },
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				createdAt: true,
				identifier: true,
				user: {
					select: { id: true, name: true, email: true },
				},
			},
		});

		const total = likes.length;
		const authenticatedCount = likes.filter((l) => l.user !== null).length;
		const anonymousCount = total - authenticatedCount;

		return res.json({
			success: true,
			data: {
				total,
				authenticatedCount,
				anonymousCount,
				likes,
			},
		});
	} catch (error) {
		return next(error);
	}
};
