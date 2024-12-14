import { sendVerificationRequest } from "@/auth/sendRequest";
import { createDefaultOrganization } from "@repo/db/data/organization";
import * as userRepository from "@repo/db/data/users";
import env from "@repo/env";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import authConfig from "./auth.config";
import { LoginSchema } from "./auth.schema";
import { adapter } from "./helpers/auth-db-adapter";
import { callbacks } from "./helpers/callbacks";
import { compareMyPassword } from "./lib";
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
		createUser: async ({ user }) => {
			if (!user.id) return;
			await createDefaultOrganization(user.id); // if you want to add anything immediately after signup action
		},
	},
	callbacks,
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
				const matched = await compareMyPassword(password, user.password);
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
