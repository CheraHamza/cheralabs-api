import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

async function handleOAuthUser({
	providerIdField,
	providerId,
	email,
	name,
	avatar,
}) {
	// Find user by provider ID or email
	let user = await prisma.user.findFirst({
		where: {
			OR: [{ [providerIdField]: providerId }, ...(email ? [{ email }] : [])],
		},
	});

	if (!user) {
		// Create new user if they don't exist
		user = await prisma.user.create({
			data: {
				[providerIdField]: providerId,
				email: email || `${providerId}@${providerIdField}.oauth`,
				name: name || `Anonymous`,
				avatar,
				role: "READER",
			},
		});
	} else if (!user[providerIdField]) {
		// Link provider ID if user exists
		user = await prisma.user.update({
			where: { id: user.id },
			data: { [providerIdField]: providerId },
		});
	}

	return user;
}

// Google Strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/api/auth/google/callback",
		},
		async (_accessToken, _refreshToken, profile, done) => {
			try {
				const user = await handleOAuthUser({
					providerIdField: "googleId",
					providerId: profile.id,
					email: profile.emails?.[0]?.value,
					name: profile.displayName,
					avatar: profile.photos?.[0]?.value,
				});
				done(null, user);
			} catch (err) {
				done(err, null);
			}
		},
	),
);

// GitHub Strategy
passport.use(
	new GitHubStrategy(
		{
			clientID: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			callbackURL: "/api/auth/github/callback",
		},
		async (_accessToken, _refreshToken, profile, done) => {
			try {
				let userEmail = profile.emails?.[0]?.value;
				if (!userEmail) {
					const response = await fetch("https://api.github.com/user/emails", {
						headers: {
							Authorization: `token ${_accessToken}`,
							"User-Agent": "Node.js",
						},
					});

					const emails = await response.json();

					if (Array.isArray(emails)) {
						const primaryObj = emails.find((e) => e.primary) || emails[0];
						userEmail = primaryObj?.email || null;
					}
				}

				const user = await handleOAuthUser({
					providerIdField: "githubId",
					providerId: profile.id,
					email: userEmail,
					name: profile.displayName || profile.username,
					avatar: profile.photos?.[0]?.value,
				});
				done(null, user);
			} catch (err) {
				done(err, null);
			}
		},
	),
);

export default passport;
