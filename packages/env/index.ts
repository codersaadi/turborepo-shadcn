import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import {
  // cloudflare,
  stripe,
  upstash,
} from "./presets";
const serverSchema = {
  DATABASE_URL: z.string(),
  AUTH_SECRET: z.string(),
  RESEND_KEY: z.string().startsWith("re_", "Invalid Resend API key format"),
  RESEND_AUDIENCE_ID: z.string(),
  EMAIL_FROM: z.string(),
  NEXT_RUNTIME: z.enum(["nodejs", "edge"]).optional(),
  GITHUB_CLIENT_ID: z.string().min(1, "GitHub Client ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GitHub Client Secret is required"),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),
  NODE_ENV: z.enum(["test", "development", "production"]),

  // Added by Sentry Integration, Vercel Marketplace
  SENTRY_ORG: z.string().min(1).optional(),
  SENTRY_PROJECT: z.string().min(1).optional(),

  FLAGS_SECRET: z.string().min(1).optional(),

  // Added by Vercel
  VERCEL: z.string().optional(),
  ANALYZE: z.string().optional(),
};

const clientSchema = {
  NEXT_PUBLIC_HOST: z
    .string()
    .url()
    .refine((url) => !url.endsWith("/"), {
      message: "HOST URL should not end with a trailing slash",
    }),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1).startsWith("G-").optional(),
};

const env = createEnv({
  server: serverSchema,
  client: clientSchema,
  emptyStringAsUndefined: true,
  runtimeEnv: {
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
    // Analytics
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,

    NODE_ENV: process.env.NODE_ENV || "development",

    // Added by Sentry Integration, Vercel Marketplace
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,

    FLAGS_SECRET: process.env.FLAGS_SECRET,
    VERCEL: process.env.VERCEL,
    ANALYZE: process.env.ANALYZE,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  onValidationError: (err) => {
    throw err;
  },
  extends: [
    stripe(),
    upstash(),
    // add this if you are using cloudflare , plugins like  aws-s3 etc
    // cloudflare(),
    // posthogPreset(),
  ],
});

export default env;
export { env };
export type AppEnv = typeof env;
