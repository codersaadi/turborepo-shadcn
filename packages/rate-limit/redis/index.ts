import { type RedisClientType, createClient } from "redis";

export type TimeWindow =
  | `${number} ms`
  | `${number} s`
  | `${number} m`
  | `${number} h`
  | `${number} d`;

// Enhanced error handling
export class RatelimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RatelimitError";
  }
}

// Parse time window to milliseconds with proper error handling
export const parseTimeWindow = (window: TimeWindow): number => {
  try {
    const [valueStr, unit] = window.split(" ");
    const value = Number.parseInt(valueStr || "s", 10);

    if (Number.isNaN(value) || value <= 0) {
      throw new RatelimitError(`Invalid time value: ${valueStr}`);
    }

    switch (unit) {
      case "ms":
        return value;
      case "s":
        return value * 1000;
      case "m":
        return value * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      case "d":
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new RatelimitError(`Invalid time unit: ${unit}`);
    }
  } catch (error) {
    if (error instanceof RatelimitError) throw error;
    throw new RatelimitError(`Failed to parse time window: ${window}`);
  }
};

// Limiter types to match Upstash's API
export interface FixedWindowOptions {
  interval: number;
  limit: number;
}

export interface SlidingWindowOptions {
  interval: number;
  limit: number;
}

export interface TokenBucketOptions {
  refillRate: number;
  interval: number;
  limit: number;
}

// Limiter functions
export const fixedWindow = (
  limit: number,
  window: TimeWindow
): FixedWindowOptions => {
  return {
    limit,
    interval: parseTimeWindow(window),
  };
};

export const slidingWindow = (
  limit: number,
  window: TimeWindow
): SlidingWindowOptions => {
  return {
    limit,
    interval: parseTimeWindow(window),
  };
};

export const tokenBucket = (
  refillRate: number,
  interval: TimeWindow,
  limit: number
): TokenBucketOptions => {
  return {
    refillRate,
    interval: parseTimeWindow(interval),
    limit,
  };
};

// Response interface with analytics
export interface RatelimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
  pending?: number;
  throughput?: number;
}

// Type for limiter algorithm
export type LimiterType =
  | FixedWindowOptions
  | SlidingWindowOptions
  | TokenBucketOptions;

// Function to detect limiter type
const getLimiterType = (limiter: LimiterType): string => {
  if ("refillRate" in limiter) return "tokenBucket";
  // Both fixed and sliding window have same properties, so we'll use an explicit property
  return "interval" in limiter ? "slidingWindow" : "fixedWindow";
};

// Configuration interface
export interface RatelimitConfig {
  redis: RedisClientType | Promise<RedisClientType>;
  limiter: LimiterType;
  prefix?: string;
  analytics?: boolean;
  timeout?: number;
  ephemeralCache?: boolean;
  ephemeralCacheTTL?: number;
}

// Memory cache for handling Redis outages
class EphemeralCache {
  private cache: Map<string, { count: number; expires: number }>;
  private ttl: number;

  constructor(ttlMs = 60000) {
    this.cache = new Map();
    this.ttl = ttlMs;
    // Clean expired items periodically
    setInterval(() => this.cleanup(), Math.min(ttlMs, 60000));
  }

  get(key: string): number {
    const now = Date.now();
    const item = this.cache.get(key);
    if (!item || item.expires < now) return 0;
    return item.count;
  }

  set(key: string, count: number, windowMs: number): void {
    this.cache.set(key, {
      count,
      expires: Date.now() + Math.min(windowMs, this.ttl),
    });
  }

  increment(key: string, windowMs: number): number {
    const now = Date.now();
    const item = this.cache.get(key) || { count: 0, expires: now + windowMs };
    if (item.expires < now) {
      item.count = 1;
      item.expires = now + windowMs;
    } else {
      item.count++;
    }
    this.cache.set(key, item);
    return item.count;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expires < now) {
        this.cache.delete(key);
      }
    }
  }
}

// Main rate limiter class
export class Ratelimit {
  private redisPromise: Promise<RedisClientType>;
  private limiter: LimiterType;
  private limiterType: string;
  private prefix: string;
  private analytics: boolean;
  private timeout: number;
  private ephemeralCache?: EphemeralCache;

  constructor(config: RatelimitConfig) {
    // Handle both direct client and promise
    this.redisPromise = Promise.resolve(config.redis);
    this.limiter = config.limiter;
    this.limiterType = getLimiterType(config.limiter);
    this.prefix = config.prefix || "ratelimit";
    this.analytics = config.analytics ?? false;
    this.timeout = config.timeout ?? 1000;

    // Create ephemeral cache if requested
    if (config.ephemeralCache) {
      this.ephemeralCache = new EphemeralCache(config.ephemeralCacheTTL);
    }
  }

  // Get the Redis client with timeout protection
  private async getRedis(): Promise<RedisClientType> {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () =>
            reject(
              new RatelimitError(
                `Redis connection timed out after ${this.timeout}ms`
              )
            ),
          this.timeout
        );
      });

      const redis = await Promise.race([this.redisPromise, timeoutPromise]);

      // Check if Redis is connected
      if (!redis.isOpen || !(await redis.ping())) {
        await redis.connect();
      }

      return redis;
    } catch (error) {
      throw new RatelimitError(
        `Failed to connect to Redis: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // Apply rate limit
  async limit(identifier: string): Promise<RatelimitResponse> {
    const now = Date.now();
    const key = `${this.prefix}:${identifier}`;

    // Try ephemeral cache first if available
    if (this.ephemeralCache && this.limiterType === "slidingWindow") {
      const windowMs = (this.limiter as SlidingWindowOptions).interval;
      const limit = (this.limiter as SlidingWindowOptions).limit;

      try {
        // Try Redis first
        return await this.applySlidingWindowLimit(key, now);
      } catch (error) {
        // Fall back to ephemeral cache on Redis failure
        console.warn(
          `Redis error, using ephemeral cache: ${error instanceof Error ? error.message : String(error)}`
        );

        const count = this.ephemeralCache.increment(key, windowMs);
        const success = count <= limit;

        return {
          success,
          limit,
          remaining: Math.max(0, limit - count),
          reset: now + windowMs,
          retryAfter: success ? 0 : Math.ceil(windowMs / 1000),
        };
      }
    }

    // Apply appropriate limiter
    try {
      switch (this.limiterType) {
        case "slidingWindow":
          return await this.applySlidingWindowLimit(key, now);
        case "fixedWindow":
          return await this.applyFixedWindowLimit(key, now);
        case "tokenBucket":
          return await this.applyTokenBucketLimit(key, now);
        default:
          throw new RatelimitError(`Unknown limiter type: ${this.limiterType}`);
      }
    } catch (error) {
      // If Redis fails and no ephemeral cache, fail open with a warning
      console.error(
        `Rate limiting error: ${error instanceof Error ? error.message : String(error)}`
      );

      // Get limit based on limiter type
      const limit = "limit" in this.limiter ? this.limiter.limit : 10;

      return {
        success: true, // Fail open
        limit,
        remaining: limit - 1,
        reset: now + 60000, // Arbitrary 1-minute reset
      };
    }
  }

  // Sliding window implementation
  private async applySlidingWindowLimit(
    key: string,
    now: number
  ): Promise<RatelimitResponse> {
    const redis = await this.getRedis();
    const { limit, interval } = this.limiter as SlidingWindowOptions;
    const windowStart = now - interval;

    const luaScript = `
      local key = KEYS[1]
      local analyticsKey = KEYS[2]
      local now = tonumber(ARGV[1])
      local windowMs = tonumber(ARGV[2])
      local maxRequests = tonumber(ARGV[3])
      local doAnalytics = tonumber(ARGV[4])
      local windowStart = now - windowMs
      
      -- Remove counts older than the current window
      redis.call('ZREMRANGEBYSCORE', key, 0, windowStart)
      
      -- Get current count
      local count = redis.call('ZCARD', key)
      
      local success = count < maxRequests
      
      -- Add current timestamp if successful
      if success then
        redis.call('ZADD', key, now, now .. ':' .. math.random())
        count = count + 1
      end
      
      -- Set expiration to keep memory usage bounded
      redis.call('PEXPIRE', key, windowMs * 2)
      
      -- Analytics if requested
      if doAnalytics == 1 then
        -- Record request timestamp for analytics
        redis.call('ZADD', analyticsKey, now, now)
        redis.call('PEXPIRE', analyticsKey, windowMs * 2)
      end
      
      -- Calculate when the oldest request expires
      local oldestTimestamp = 0
      if count >= maxRequests then
        local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
        if #oldest >= 2 then
          oldestTimestamp = tonumber(oldest[2])
        end
      end
      
      -- Calculate pending and throughput if analytics enabled
      local pending = 0
      local throughput = 0
      if doAnalytics == 1 then
        pending = count
        -- Calculate requests in the last second
        local secondAgo = now - 1000
        throughput = redis.call('ZCOUNT', analyticsKey, secondAgo, '+inf')
      end
      
      -- Return results
      return {
        success and 1 or 0, 
        maxRequests, 
        math.max(0, maxRequests - count), 
        now + windowMs,
        oldestTimestamp > 0 and math.ceil((oldestTimestamp + windowMs - now) / 1000) or 0,
        pending,
        throughput
      }
    `;

    try {
      const analyticsKey = `${key}:analytics`;
      const result = await redis.eval(luaScript, {
        keys: [key, analyticsKey],
        arguments: [
          now.toString(),
          interval.toString(),
          limit.toString(),
          this.analytics ? "1" : "0",
        ],
      });

      if (!Array.isArray(result)) {
        throw new RatelimitError("Invalid response from Redis");
      }

      const response: RatelimitResponse = {
        success: Boolean(result[0]),
        limit: Number(result[1]),
        remaining: Number(result[2]),
        reset: Number(result[3]),
      };

      // Add conditional properties
      const retryAfter = Number(result[4]);
      if (retryAfter > 0) response.retryAfter = retryAfter;

      if (this.analytics) {
        response.pending = Number(result[5]);
        response.throughput = Number(result[6]);
      }

      // Store in ephemeral cache if available
      if (this.ephemeralCache) {
        this.ephemeralCache.set(key, limit - response.remaining, interval);
      }

      return response;
    } catch (error) {
      throw new RatelimitError(
        `Sliding window limit error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // Fixed window implementation
  private async applyFixedWindowLimit(
    key: string,
    now: number
  ): Promise<RatelimitResponse> {
    const redis = await this.getRedis();
    const { limit, interval } = this.limiter as FixedWindowOptions;

    // Create window key with fixed time boundary
    const windowKey = `${key}:${Math.floor(now / interval)}`;

    const luaScript = `
      local key = KEYS[1]
      local analyticsKey = KEYS[2]
      local limit = tonumber(ARGV[1])
      local windowMs = tonumber(ARGV[2])
      local doAnalytics = tonumber(ARGV[3])
      local now = tonumber(ARGV[4])
      
      -- Increment counter for this window
      local count = redis.call('INCR', key)
      
      -- Set expiration if this is first request in window
      if count == 1 then
        redis.call('PEXPIRE', key, windowMs * 2)
      end
      
      local success = count <= limit
      
      -- Analytics
      if doAnalytics == 1 then
        redis.call('ZADD', analyticsKey, now, now)
        redis.call('PEXPIRE', analyticsKey, windowMs)
      end
      
      -- Calculate remaining time in window
      local ttl = redis.call('PTTL', key)
      if ttl < 0 then ttl = windowMs end
      
      -- Calculate throughput if analytics enabled
      local throughput = 0
      if doAnalytics == 1 then
        -- Calculate requests in the last second
        local secondAgo = now - 1000
        throughput = redis.call('ZCOUNT', analyticsKey, secondAgo, '+inf')
      end
      
      return {
        success and 1 or 0,
        limit,
        math.max(0, limit - count),
        now + ttl,
        success and 0 or math.ceil(ttl / 1000),
        count,
        throughput
      }
    `;

    try {
      const analyticsKey = `${key}:analytics`;
      const result = await redis.eval(luaScript, {
        keys: [windowKey, analyticsKey],
        arguments: [
          limit.toString(),
          interval.toString(),
          this.analytics ? "1" : "0",
          now.toString(),
        ],
      });

      if (!Array.isArray(result)) {
        throw new RatelimitError("Invalid response from Redis");
      }

      const response: RatelimitResponse = {
        success: Boolean(result[0]),
        limit: Number(result[1]),
        remaining: Number(result[2]),
        reset: Number(result[3]),
      };

      const retryAfter = Number(result[4]);
      if (retryAfter > 0) response.retryAfter = retryAfter;

      if (this.analytics) {
        response.pending = Number(result[5]);
        response.throughput = Number(result[6]);
      }

      return response;
    } catch (error) {
      throw new RatelimitError(
        `Fixed window limit error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // Token bucket implementation
  private async applyTokenBucketLimit(
    key: string,
    now: number
  ): Promise<RatelimitResponse> {
    const redis = await this.getRedis();
    const { limit, refillRate, interval } = this.limiter as TokenBucketOptions;

    const luaScript = `
      local key = KEYS[1]
      local analyticsKey = KEYS[2]
      local now = tonumber(ARGV[1])
      local refillRate = tonumber(ARGV[2])
      local refillInterval = tonumber(ARGV[3])
      local bucketCapacity = tonumber(ARGV[4])
      local doAnalytics = tonumber(ARGV[5])
      
      -- Get current bucket state
      local bucketInfo = redis.call('HMGET', key, 'tokens', 'lastRefill')
      local tokens = tonumber(bucketInfo[1]) or bucketCapacity
      local lastRefill = tonumber(bucketInfo[2]) or 0
      
      -- Calculate token refill
      local elapsedTime = now - lastRefill
      local tokensToAdd = math.floor(elapsedTime * (refillRate / refillInterval))
      
      if tokensToAdd > 0 then
        -- Add tokens based on elapsed time
        tokens = math.min(bucketCapacity, tokens + tokensToAdd)
        lastRefill = now
      end
      
      -- Try to consume a token
      local success = tokens >= 1
      if success then
        tokens = tokens - 1
      end
      
      -- Save updated bucket state
      redis.call('HMSET', key, 'tokens', tokens, 'lastRefill', lastRefill)
      redis.call('PEXPIRE', key, refillInterval * 2)
      
      -- Analytics
      if doAnalytics == 1 then
        redis.call('ZADD', analyticsKey, now, now)
        redis.call('PEXPIRE', analyticsKey, refillInterval)
      end
      
      -- Calculate time until next token refill
      local timeToNextToken = success and 0 or math.ceil((1 - tokens) * (refillInterval / refillRate))
      
      -- Calculate throughput if analytics enabled
      local throughput = 0
      if doAnalytics == 1 then
        -- Calculate requests in the last second
        local secondAgo = now - 1000
        throughput = redis.call('ZCOUNT', analyticsKey, secondAgo, '+inf')
      end
      
      return {
        success and 1 or 0,
        bucketCapacity,
        tokens,
        now + (refillInterval / refillRate),
        timeToNextToken,
        bucketCapacity - tokens,
        throughput
      }
    `;

    try {
      const analyticsKey = `${key}:analytics`;
      const result = await redis.eval(luaScript, {
        keys: [key, analyticsKey],
        arguments: [
          now.toString(),
          refillRate.toString(),
          interval.toString(),
          limit.toString(),
          this.analytics ? "1" : "0",
        ],
      });

      if (!Array.isArray(result)) {
        throw new RatelimitError("Invalid response from Redis");
      }

      const response: RatelimitResponse = {
        success: Boolean(result[0]),
        limit: Number(result[1]),
        remaining: Number(result[2]),
        reset: Number(result[3]),
      };

      const retryAfter = Number(result[4]);
      if (retryAfter > 0) response.retryAfter = retryAfter;

      if (this.analytics) {
        response.pending = Number(result[5]);
        response.throughput = Number(result[6]);
      }

      return response;
    } catch (error) {
      throw new RatelimitError(
        `Token bucket limit error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  // Modified block method to prevent infinite loop
  async block(
    identifier: string,
    maxWaitMs = 5000
  ): Promise<RatelimitResponse> {
    const startTime = Date.now();
    let attempts = 0;
    const maxAttempts = 100; // Safeguard against infinite loops

    while (attempts < maxAttempts) {
      attempts++;
      const response = await this.limit(identifier);

      if (response.success) {
        return response;
      }

      const currentTime = Date.now();
      if (currentTime - startTime >= maxWaitMs) {
        throw new RatelimitError(
          `Rate limit exceeded for ${identifier} after waiting ${currentTime - startTime}ms`
        );
      }

      const waitTime = Math.max(
        50,
        Math.min(
          500,
          response.retryAfter ? (response.retryAfter * 1000) / 2 : 100
        )
      );

      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    // This is a safeguard in case we reach max attempts
    throw new RatelimitError(
      `Rate limit exceeded for ${identifier} after ${maxAttempts} attempts`
    );
  }
  // Reset rate limit for an identifier
  async reset(identifier: string): Promise<void> {
    try {
      const redis = await this.getRedis();
      const key = `${this.prefix}:${identifier}`;

      await redis.del(key);
      await redis.del(`${key}:analytics`);

      // Also clear ephemeral cache if available
      if (this.ephemeralCache) {
        this.ephemeralCache.set(key, 0, 0);
      }
    } catch (error) {
      throw new RatelimitError(
        `Failed to reset rate limit: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
import { env } from "@repo/env";
let redisClient: RedisClientType | undefined;
const getRedisSingleClient = () => {
  if (redisClient) {
    return redisClient;
  }
  redisClient = createClient({
    url: env.REDIS_CLIENT || "redis://localhost:6379",
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
    },
  }) as RedisClientType;
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  // Connect automatically
  (async () => {
    try {
      if (!redisClient.isOpen || !(await redisClient.ping())) {
        await redisClient.connect();
      }
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
    }
  })();
  return redisClient;
};
// Factory function
export interface CreateRateLimiterProps
  extends Omit<RatelimitConfig, "redis"> {}

export const createRateLimiter = (
  props?: CreateRateLimiterProps & {
    limiter?: LimiterType;
  }
) => {
  const redis = getRedisSingleClient();
  return new Ratelimit({
    redis,
    limiter: props?.limiter ?? slidingWindow(10, "10 s"),
    prefix: props?.prefix ?? "web-turbo",
    analytics: props?.analytics ?? false,
    timeout: props?.timeout ?? 1000,
    ephemeralCache: props?.ephemeralCache ?? true,
    ephemeralCacheTTL: props?.ephemeralCacheTTL ?? 60000,
  });
};
