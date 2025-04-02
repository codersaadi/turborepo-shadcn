import { env } from "@repo/env";
import type { NextAuthConfig } from "next-auth";

import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  trustHost: true,

  providers: [
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      clientId: env.GOOGLE_CLIENT_ID,
    }),
  ],
} satisfies NextAuthConfig;
