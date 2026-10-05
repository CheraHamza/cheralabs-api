import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { COOKIE_OPTIONS } from "./auth.js";

export const getUserProfile = async (req, res, next) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user.id },
			select: {
				id: true,
				email: true,
				name: true,
				avatar: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user) {
			return next(new AppError("User not found", 404));
		}

		return res.json({
			success: true,
			data: user,
		});
	} catch (error) {
		return next(error);
	}
};

export const updateUserProfile = async (req, res, next) => {
	try {
		const { name, avatar } = req.body;

		if (!name && !avatar) {
			return next(
				new AppError("At least one field (name or avatar) is required", 400),
			);
		}

		const updatedUser = await prisma.user.update({
			where: { id: req.user.id },
			data: {
				...(name && { name }),
				...(avatar && { avatar }),
			},
			select: {
				id: true,
				email: true,
				name: true,
				avatar: true,
				role: true,
				updatedAt: true,
			},
		});

		return res.json({
			success: true,
			message: "Profile updated successfully",
			data: updatedUser,
		});
	} catch (error) {
		return next(error);
	}
};

export const deleteUserProfile = async (req, res, next) => {
	try {
		await prisma.user.delete({
			where: { id: req.user.id },
		});

		res.clearCookie("token", COOKIE_OPTIONS);

		return res.json({
			success: true,
			message: "Account deleted Successfully",
		});
	} catch (error) {
		return next(error);
	}
};
