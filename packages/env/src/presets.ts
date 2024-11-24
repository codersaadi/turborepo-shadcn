import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const cloudflare = () =>
  createEnv({
    server: {
      CLOUDFLARE_ACCOUNT_ID: z.string(),
      CLOUDFLARE_ACCESS_KEY_ID: z.string(),
      CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
      CLOUDFLARE_BUCKET_NAME: z.string(),
    },
    runtimeEnv: process.env,
  });

export const stripe = () =>
  createEnv({
    clientPrefix: "NEXT_PUBLIC_",
    server: {
      STRIPE_WEBHOOK_SECRET_LIVE: z.string().optional(),
      STRIPE_API_KEY: z.string().optional(),
      STRIPE_WEBHOOK_SECRET: z.string().optional(),
    },
    client: {
      NEXT_PUBLIC_PRICE_ID_BASIC: z.string(),
      NEXT_PUBLIC_PRICE_ID_PREMIUM: z.string(),
    },
    runtimeEnv: process.env,
  });
