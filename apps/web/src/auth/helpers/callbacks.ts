import { getUserActiveOrg } from "@repo/db/data/userOrganizations";
import * as userRepository from "@repo/db/data/users";
import type { NextAuthConfig } from "next-auth";

/**
 * callbacks - NextAuth (Auth.js) callbacks
 */
export const callbacks = {
	async signIn({ user, account }) {
		const provider = account?.provider;
		// if the account provider is other than magic-email and credentials,
		//  (e.g oauth , or web) we will return true
		if (provider !== "credentials" && provider !== "email") return true;

		if (!user || !user.id) return false;
		const existingUser = await userRepository.getUserById(user.id);

		//  if there is no user or  provider is credentials and not verified we will redirect. or if user is using magic link email but there is no user we will redirect.
		if (
			!existingUser ||
			(provider === "credentials" && !existingUser.emailVerified)
		) {
			if (provider === "email") return "/auth/signup";
			// it will redirect with a digest in the redirect (we will display the redirect page based on that digest, we have a utility called handleSignInRedirectError for this case).
			return false;
		}
		return true;
	},

	//  jwt is called when the JWT is created

	async jwt(data) {
		const { token } = data;

		if (!token.sub) return token;
		if (
			data.trigger === "signIn" ||
			data.trigger === "signUp" ||
			data.trigger === "update"
		) {
			const existingUser = await userRepository.getUserById(token.sub);
			if (!existingUser) return token;

			token.activeOrgId = existingUser.activeOrgId;
			token.email = existingUser.email;
			token.name = existingUser.name;
			token.picture = existingUser.image;
			token.stripeCustomerId = existingUser.stripeCustomerId;
			if (existingUser.activeOrgId) {
				const activeOrg = await getUserActiveOrg({
					userId: existingUser.id,
					organizationId: existingUser.activeOrgId,
				});
				if (!activeOrg) return token;
				token.role = activeOrg.role;
			}
		}
		return token;
	},
	// session uses the JWT token to create and generate the session object
	async session({ session, token }) {
		if (session.user) {
			if (token.sub) session.user.id = token.sub;
			if (token.email) session.user.email = token.email;
			if (token.name) session.user.name = token.name;
			if (token.picture) session.user.image = token.picture;
			if (token.stripeCustomerId)
				session.user.stripeCustomerId = isString(token.stripeCustomerId);
			if (token.activeOrgId)
				session.user.activeOrgId = isString(token.activeOrgId);
			if (token.role) session.user.role = isString(token.role);
		}

		return session;
	},
} satisfies NextAuthConfig["callbacks"];

const isString = (id: unknown): string | null =>
	id && typeof id === "string" ? id : null;
