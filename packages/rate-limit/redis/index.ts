// https://www.npmjs.com/package/oss-ratelimit
import { createSingletonRateLimiter, slidingWindow } from "oss-ratelimit";
// https://github.com/codersaadi/oss-ratelimit

// for un authenticated users (can say Global Limiter)
export const strictLimiter = createSingletonRateLimiter({
  limiter: slidingWindow(5, "10 s"), // Stricter limits
  prefix: "unauthenticated",
});
// for authenticated-users
export const secureLimiter = createSingletonRateLimiter({
  prefix: "authenticated",
  limiter: slidingWindow(10, "10 s"),
});

export * from "oss-ratelimit";
