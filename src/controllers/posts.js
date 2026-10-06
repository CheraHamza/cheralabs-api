import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { slugify } from "../utils/slug.js";

export const getPublishedPosts = async (req, res, next) => {
	try {
		const posts = await prisma.post.findMany({
			where: { published: true },
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				slug: true,
				createdAt: true,
				author: {
					select: { name: true, avatar: true },
				},
				category: {
					select: { id: true, name: true, slug: true },
				},
				tags: {
					select: { id: true, name: true, slug: true },
				},
				_count: {
					select: {
						comments: true,
						likes: true,
					},
				},
			},
		});

		return res.json({ success: true, count: posts.length, data: posts });
	} catch (error) {
		return next(error);
	}
};

export const getPostBySlug = async (req, res, next) => {
	try {
		const { slug } = req.params;

		const post = await prisma.post.findFirst({
			where: { slug, published: true },
			include: {
				author: {
					select: { id: true, name: true, avatar: true },
				},
				category: {
					select: { id: true, name: true, slug: true },
				},
				tags: {
					select: { id: true, name: true, slug: true },
				},
				_count: {
					select: { likes: true, comments: true },
				},
			},
		});

		if (!post) {
			return next(new AppError("Post not found", 404));
		}

		return res.json({ success: true, data: post });
	} catch (error) {
		return next(error);
	}
};

export const getAllPostsAdmin = async (req, res, next) => {
	try {
		const posts = await prisma.post.findMany({
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				slug: true,
				published: true,
				createdAt: true,
				author: {
					select: { name: true, email: true, avatar: true },
				},
				category: {
					select: { id: true, name: true, slug: true },
				},
				tags: {
					select: { id: true, name: true, slug: true },
				},
				_count: {
					select: {
						comments: true,
						likes: true,
					},
				},
			},
		});

		return res.json({ success: true, count: posts.length, data: posts });
	} catch (error) {
		return next(error);
	}
};

export const getPostByIdAdmin = async (req, res, next) => {
	try {
		const { id } = req.params;

		const post = await prisma.post.findUnique({
			where: { id },
			include: {
				author: {
					select: { id: true, name: true, email: true, avatar: true },
				},
				category: {
					select: { id: true, name: true, slug: true },
				},
				tags: {
					select: { id: true, name: true, slug: true },
				},
				_count: {
					select: {
						comments: true,
						likes: true,
					},
				},
			},
		});

		if (!post) {
			return next(new AppError("Post not found", 404));
		}

		return res.json({ success: true, data: post });
	} catch (error) {
		return next(err);
	}
};

export const createPost = async (req, res, next) => {
	try {
		const { title, content, published, categoryId, tagIds } = req.body;

		let slug = slugify(title);

		// Handle collision if a post with the same slug already exists
		const existingPost = await prisma.post.findUnique({ where: { slug } });
		if (existingPost) {
			slug = `${slug}-${Date.now().toString().slice(-4)}`;
		}

		const post = await prisma.post.create({
			data: {
				title,
				slug,
				content,
				published: published ?? false,
				authorId: req.user.id,
				...(categoryId && { categoryId }),
				...(tagIds &&
					tagIds.length > 0 && {
						tags: {
							connect: tagIds.map((id) => ({ id })),
						},
					}),
			},
			include: {
				category: {
					select: { id: true, name: true, slug: true },
				},
				tags: {
					select: { id: true, name: true, slug: true },
				},
			},
		});

		return res.status(201).json({
			success: true,
			message: "Post created successfully",
			data: post,
		});
	} catch (error) {
		return next(error);
	}
};

export const updatePost = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, content, published, categoryId, tagIds } = req.body;

		let slug;

		if (title) {
			slug = slugify(title);
			const existing = await prisma.post.findFirst({
				where: { slug, NOT: { id } },
			});
			if (existing) {
				slug = `${slug}-${Date.now().toString().slice(-4)}`;
			}
		}

		const updatedPost = await prisma.post.update({
			where: { id },
			data: {
				...(title && { title, slug }),
				...(content && { content }),
				...(published !== undefined && { published }),
				...(categoryId !== undefined && { categoryId }),
				...(tagIds !== undefined && {
					tags: {
						set: tagIds.map((id) => ({ id })),
					},
				}),
			},
			include: {
				category: {
					select: { id: true, name: true, slug: true },
				},
				tags: {
					select: { id: true, name: true, slug: true },
				},
			},
		});

		return res.json({
			success: true,
			message: "Post updated successfully",
			data: updatedPost,
		});
	} catch (error) {
		return next(error);
	}
};

export const deletePost = async (req, res, next) => {
	try {
		const { id } = req.params;

		await prisma.post.delete({
			where: { id },
		});

		return res.json({
			success: true,
			message: "Post deleted successfully",
		});
	} catch (error) {
		return next(error);
	}
};
