import { createRateLimiter, slidingWindow } from "./redis";

export * from "./redis";
export * as withUpstash from "./upstash";

// for un authenticated users (can say Global Limiter)
export const strictLimiter = createRateLimiter({
  limiter: slidingWindow(5, "10 s"), // Stricter limits
  prefix: "unauthenticated",
});
// for authenticated-users
export const secureLimiter = createRateLimiter({
  prefix: "authenticated",
  limiter: slidingWindow(10, "10 s"),
});
