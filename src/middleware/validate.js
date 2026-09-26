import { ZodError } from "zod";

export const validate = (schema) => async (req, res, next) => {
	try {
		const parsed = await schema.parseAsync({
			body: req.body,
			query: req.query,
			params: req.params,
		});

		req.body = parsed.body;
		req.query = parsed.query;
		req.params = parsed.params;

		return next();
	} catch (error) {
		if (error instanceof ZodError) {
			return next(error);
		}
		return next(error);
	}
};