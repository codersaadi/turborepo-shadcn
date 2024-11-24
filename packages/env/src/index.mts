import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
// import { cloudflare } from "./presets.mjs";
const serverSchema = {
  // DATABASE_URL: z.string(),
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
    // DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
  },
  // extends: [cloudflare()],
});

export default env;
