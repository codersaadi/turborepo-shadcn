// import env from "@repo/env";
// import { Ratelimit, type RatelimitConfig } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

// export const redis = new Redis({
//   url: env.UPSTASH_REDIS_REST_URL,
//   token: env.UPSTASH_REDIS_REST_TOKEN,
// });

// export const { slidingWindow } = Ratelimit;
// export interface CreateRateLimiterProps
//   extends Omit<RatelimitConfig, "redis"> {}

// export const createRateLimiter = (props: CreateRateLimiterProps) =>
//   new Ratelimit({
//     redis,
//     limiter: props.limiter ?? slidingWindow(10, "10 s"),
//     prefix: props.prefix ?? "web-turbo",
//   });
