import { slugify } from "../utils/slug.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

export const getAllTags = async (req, res, next) => {
	try {
		const tags = await prisma.tag.findMany({
			orderBy: { name: "asc" },
			select: {
				id: true,
				name: true,
				slug: true,
				_count: {
					select: { posts: true },
				},
			},
		});

		return res.json({ success: true, count: tags.length, data: tags });
	} catch (error) {
		return next(error);
	}
};

export const getPostsByTag = async (req, res, next) => {
	try {
		const { slug } = req.params;

		const tag = await prisma.tag.findUnique({
			where: { slug },
			select: {
				id: true,
				name: true,
				slug: true,
				posts: {
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
				},
			},
		});

		if (!tag) {
			return next(new AppError("Tag not found", 404));
		}

		return res.json({ success: true, data: tag });
	} catch (error) {
		return next(error);
	}
};

export const createTag = async (req, res, next) => {
	try {
		const { name } = req.body;
		const slug = slugify(name);

		const existingTag = await prisma.tag.findFirst({
			where: { OR: [{ name }, { slug }] },
		});

		if (existingTag) {
			return next(new AppError("Tag name or slug already exists", 400));
		}

		const tag = await prisma.tag.create({
			data: { name, slug },
		});

		return res.status(201).json({
			success: true,
			message: "Tag created successfully",
			data: tag,
		});
	} catch (error) {
		return next(error);
	}
};

export const updateTag = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		const existingTag = await prisma.tag.findUnique({ where: { id } });
		if (!existingTag) {
			return next(new AppError("Tag not found", 404));
		}

		const slug = slugify(name);

		const existing = await prisma.tag.findFirst({
			where: {
				OR: [{ name }, { slug }],
				NOT: { id },
			},
		});

		if (existing) {
			return next(new AppError("Tag name or slug already in use", 400));
		}

		const updatedTag = await prisma.tag.update({
			where: { id },
			data: { name, slug },
		});

		return res.json({
			success: true,
			message: "Tag updated successfully",
			data: updatedTag,
		});
	} catch (error) {
		return next(error);
	}
};

export const deleteTag = async (req, res, next) => {
	try {
		const { id } = req.params;

		const tag = await prisma.tag.findUnique({ where: { id } });
		if (!tag) {
			return next(new AppError("Tag not found", 404));
		}

		await prisma.tag.delete({ where: { id } });

		return res.json({
			success: true,
			message: "Tag deleted successfully",
		});
	} catch (error) {
		return next(error);
	}
};
