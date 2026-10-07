import crypto from "crypto";

export const getClientIdentifier = (req) => {
	const ip =
		req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
		req.socket.remoteAddress ||
		"127.0.0.1";

	const userAgent = req.headers["user-agent"] || "";
	const clientFingerprint = req.body?.fingerprint || "";

	const rawString = `${ip}-${userAgent}-${clientFingerprint}`;

	return crypto.createHash("sha256").update(rawString).digest("hex");
};
