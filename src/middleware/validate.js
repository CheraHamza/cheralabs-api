import { ZodError } from "zod";

export const validate = (schema) => async (req, res, next) => {
	try {
		const parsed = await schema.parseAsync({
			body: req.body,
			query: req.query,
			params: req.params,
		});

		if (parsed.body) req.body = parsed.body;
		if (parsed.params) req.params = parsed.params;

		if (parsed.query) {
			Object.assign(req.query, parsed.query);
		}
		
		return next();
	} catch (error) {
		if (error instanceof ZodError) {
			return next(error);
		}
		return next(error);
	}
};
