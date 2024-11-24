import { DrizzleAdapter } from "@auth/drizzle-adapter";
import * as userRepository from "@repo/db/data/users";
import {
	type User,
	accounts,
	sessions,
	users,
	verificationTokens,
} from "@repo/db/schema";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import authConfig from "./auth.config";

import { sendVerificationRequest } from "@/auth/sendRequest";
import { db } from "@repo/db";
import env from "@repo/env";
import { LoginSchema } from "./auth.schema";
const adapter = DrizzleAdapter(db, {
	accountsTable: accounts,
	sessionsTable: sessions,
	usersTable: users,
	verificationTokensTable: verificationTokens,
});

export const nextauth = NextAuth({
	pages: {
		signIn: "/auth/signin",
		verifyRequest: "/auth/verify-request",
		error: "/auth-error",
		signOut: "/signout",
	},
	events: {
		linkAccount: async ({ user }) => {
			if (!user.id) return;
			const email = user.email || undefined;
			await userRepository.verifyUserEmail(user.id, email);
		},
	},
	callbacks: {
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

		async jwt({ token, trigger }) {
			if (!token.sub) return token;
			if (trigger === "signIn" || trigger === "update") {
				const existingUser = await userRepository.getUserById(token.sub);
				if (!existingUser) return token;
				token.email = existingUser.email;
				token.name = existingUser.name;
				token.picture = existingUser.image;
				token.stripeCustomerId = existingUser.stripeCustomerId;
				token.role = existingUser.role;
			}
			return token;
		},
		// session uses the JWT token to create and generate the session object
		async session({ session, token }) {
			if (session.user) {
				if (token.role)
					session.user.role = typeGuards.useRoleTypeGuard(token.role);
				if (token.sub) session.user.id = token.sub;
				if (token.email) session.user.email = token.email;
				if (token.name) session.user.name = token.name;
				if (token.picture) session.user.image = token.picture;
				if (token.stripeCustomerId)
					session.user.stripeCustomerId = typeGuards.stripeCustomerIdTypeGuard(
						token.stripeCustomerId,
					);
			}

			return session;
		},
	},
	adapter,

	session: { strategy: "jwt" },
	trustHost: authConfig.trustHost,

	providers: [
		...authConfig.providers,
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const validate = await LoginSchema.parseAsync(credentials);
				if (!validate) return null;
				const { email, password } = validate;
				const user = await userRepository.getUserByEmail(email);
				if (!user || !user.password) return null;
				const matched = await bcrypt.compare(password, user.password);
				if (matched) return user;

				return user;
			},
		}),
		Resend({
			apiKey: env.RESEND_KEY,
			from: env.EMAIL_FROM,
			sendVerificationRequest: sendVerificationRequest,
		}),
	],
});
const typeGuards = {
	useRoleTypeGuard: (role: unknown): User["role"] =>
		role &&
		typeof role === "string" &&
		(role === "admin" || role === "user" || role === "member")
			? role
			: "user",
	stripeCustomerIdTypeGuard: (id: unknown): string | null =>
		id && typeof id === "string" ? id : null,
};
