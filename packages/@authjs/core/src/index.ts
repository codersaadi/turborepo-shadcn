import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@repo/db";
import * as userRepository from "@repo/db/data/users";
import { accounts, sessions, users, verificationTokens } from "@repo/db/schema";
import env from "@repo/env";
import bcrypt from "bcryptjs";
import NextAuth, { type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import authConfig from "./auth.config";
import type { SessionUser } from "./lib/types";
import { LoginSchema } from "./schema";
import { sendVerificationRequest } from "./send-request";
const adapter = DrizzleAdapter(db, {
  accountsTable: accounts,
  sessionsTable: sessions,
  usersTable: users,
  verificationTokensTable: verificationTokens,
});

export const {
  signIn,
  handlers,
  signOut,
  unstable_update: updateSessionTrigger,
  auth,
} = NextAuth({
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
      // await createDefaultOrganization(user.id); // if you want to add anything immediately after signup action
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

    async jwt({ trigger, token }) {
      if (!token.sub) return token;
      if (
        trigger === "signIn" ||
        trigger === "signUp" ||
        trigger === "update"
      ) {
        const existingUser = await userRepository.getUserById(token.sub);
        if (!existingUser) return token;

        token.email = existingUser.email;
        token.name = existingUser.name;
        token.picture = existingUser.image;
        token.stripeCustomerId = existingUser.stripeCustomerId;
        token.emailVerified = existingUser.emailVerified;
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
          session.user.stripeCustomerId = typeGuards.isString(
            token.stripeCustomerId
          );
        if (token.emailVerified)
          session.user.emailVerified = typeGuards.isDate(token.emailVerified);
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
        return null;
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
  isString: (id: unknown): string | null =>
    id && typeof id === "string" ? id : null,
  isDate: (date: unknown): Date | null =>
    date && typeof date === "string" ? new Date(date) : null,
};
export const forEdgeAuth = NextAuth(authConfig);

export type $UserRole = "user" | "admin" | "member";
import { AdapterUser } from "@auth/core/adapters";
import type { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import type { NextRequest } from "next/server";
/**
 * Here you can extend your session and auth types
 */

declare module "next-auth" {
  interface Session {
    user: SessionUser & DefaultSession["user"];
  }
  interface NextAuthRequest extends NextRequest {
    auth: Session | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    stripeCustomerId: string | null;
    emailVerified: Date | null;
  }
}
declare module "@auth/core/adapters" {
  interface AdapterUser {
    user: SessionUser;
  }
}
