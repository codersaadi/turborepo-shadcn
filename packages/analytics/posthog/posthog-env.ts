import typesafeEnv, { type AppEnv } from "@repo/env";
// we are assuming that you are using the posthog preset in the @repo/env, in the extends option
export const env = typesafeEnv as AppEnv & {
  NEXT_PUBLIC_POSTHOG_KEY: string;
  NEXT_PUBLIC_POSTHOG_HOST: string;
};
