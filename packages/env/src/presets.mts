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
