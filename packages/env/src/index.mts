import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
// import { cloudflare, stripe } from "./presets.mjs";
const serverSchema = {
  DATABASE_URL: z.string(),
  AUTH_SECRET: z.string(),
  RESEND_KEY: z.string().startsWith("re_", "Invalid Resend API key format"),
  RESEND_AUDIENCE_ID: z.string(),
  EMAIL_FROM: z.string(),

  GITHUB_CLIENT_ID: z.string().min(1, "GitHub Client ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GitHub Client Secret is required"),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),
  // env can be test, development, production
  NODE_ENV: z.enum(["test", "development", "production"]),
};

const clientSchema = {
  NEXT_PUBLIC_HOST: z
    .string()
    .url()
    .refine((url) => !url.endsWith("/"), {
      message: "HOST URL should not end with a trailing slash",
    }),
};

const env = createEnv({
  clientPrefix: "NEXT_PUBLIC_",
  server: serverSchema,
  client: clientSchema,
  emptyStringAsUndefined: true,
  runtimeEnvStrict: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
    EMAIL_FROM: process.env.EMAIL_FROM,
    // Resend env
    RESEND_KEY: process.env.RESEND_KEY,
    RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
    // Auth env
    AUTH_SECRET: process.env.AUTH_SECRET,
    // OAuth env
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    NODE_ENV: process.env.NODE_ENV || "development",
  },
  // extends: [cloudflare(), stripe()],
});

export default env;
