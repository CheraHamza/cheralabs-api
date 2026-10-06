import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { slugify } from "../utils/slug.js";

export const getAllCategories = async (req, res, next) => {
	try {
		const categories = await prisma.category.findMany({
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

		return res.json({
			success: true,
			count: categories.length,
			data: categories,
		});
	} catch (error) {
		return next(error);
	}
};

export const getPostsByCategory = async (req, res, next) => {
	try {
		const { slug } = req.params;

		const category = await prisma.category.findUnique({
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
						tags: {
							select: { id: true, name: true, slug: true },
						},
						_count: {
							select: { comments: true, likes: true },
						},
					},
				},
			},
		});

		if (!category) {
			return next(new AppError("Category not found", 404));
		}

		return res.json({ success: true, data: category });
	} catch (error) {
		return next(error);
	}
};

export const createCategory = async (req, res, next) => {
	try {
		const { name } = req.body;
		const slug = slugify(name);

		const existingCategory = await prisma.category.findFirst({
			where: { OR: [{ name }, { slug }] },
		});

		if (existingCategory) {
			return next(new AppError("Category name or slug already exists", 400));
		}

		const category = await prisma.category.create({
			data: { name, slug },
		});

		return res.status(201).json({
			success: true,
			message: "Category created successfully",
			data: category,
		});
	} catch (error) {
		return next(error);
	}
};

export const updateCategory = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		const existingCategory = await prisma.category.findUnique({
			where: { id },
		});

		if (!existingCategory) {
			return next(new AppError("Category not found", 404));
		}

		let slug;
		if (name) {
			slug = slugify(name);

			const existing = await prisma.category.findFirst({
				where: {
					OR: [{ name }, { slug }],
					NOT: { id },
				},
			});

			if (existing) {
				return next(new AppError("Category name or slug already in use", 400));
			}
		}

		const updatedCategory = await prisma.category.update({
			where: { id },
			data: {
				...(name && { name, slug }),
			},
		});

		return res.json({
			success: true,
			message: "Category updated successfully",
			data: updatedCategory,
		});
	} catch (error) {
		return next(error);
	}
};

export const deleteCategory = async (req, res, next) => {
	try {
		const { id } = req.params;

		const category = await prisma.category.findUnique({
			where: { id },
		});

		if (!category) {
			return next(new AppError("Category not found", 404));
		}

		await prisma.category.delete({ where: { id } });

		return res.json({
			success: true,
			message: "Category deleted successfully",
		});
	} catch (error) {
		return next(error);
	}
};
