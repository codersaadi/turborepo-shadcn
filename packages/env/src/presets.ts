import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
export { vercel } from "@t3-oss/env-core/presets";
export const cloudflare = () =>
  createEnv({
    server: {
      CLOUDFLARE_ACCOUNT_ID: z.string(),
      CLOUDFLARE_ACCESS_KEY_ID: z.string(),
      CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
      CLOUDFLARE_BUCKET_NAME: z.string(),
    },
    runtimeEnv: {
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
      CLOUDFLARE_ACCESS_KEY_ID: process.env.CLOUDFLARE_ACCESS_KEY_ID,
      CLOUDFLARE_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
      CLOUDFLARE_BUCKET_NAME: process.env.CLOUDFLARE_BUCKET_NAME,
    },
  });

export const stripe = () =>
  createEnv({
    server: {
      STRIPE_WEBHOOK_SECRET_LIVE: z.string().optional(),
      STRIPE_API_KEY: z.string().optional(),
      STRIPE_WEBHOOK_SECRET: z.string().optional(),
    },
    client: {
      NEXT_PUBLIC_PRICE_ID_BASIC: z.string(),
      NEXT_PUBLIC_PRICE_ID_PREMIUM: z.string(),
    },
    runtimeEnv: {
      STRIPE_WEBHOOK_SECRET_LIVE: process.env.STRIPE_WEBHOOK_SECRET_LIVE,
      STRIPE_API_KEY: process.env.STRIPE_API_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      NEXT_PUBLIC_PRICE_ID_BASIC: process.env.NEXT_PUBLIC_PRICE_ID_BASIC,
      NEXT_PUBLIC_PRICE_ID_PREMIUM: process.env.NEXT_PUBLIC_PRICE_ID_PREMIUM,
    },
  });

export const posthogPreset = () => {
  return createEnv({
    client: {
      NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).startsWith("phc_"),
      NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1).url(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    },
  });
};

export const upstash = () => {
  return createEnv({
    server: {
      UPSTASH_REDIS_REST_URL: z.string().min(1).url().optional(),
      UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
    },
    runtimeEnv: {
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    },
  });
};
