export const slugify = (text) => {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[\s\W_]+?/g, "-")
		.replace(/^-+|-+$/g, "");
};
