import { type RedisClientType, createClient } from "redis";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Ratelimit,
  RatelimitError,
  type TimeWindow,
  fixedWindow,
  parseTimeWindow,
  slidingWindow,
  tokenBucket,
} from "./index";

// Mock Redis client
vi.mock("redis", () => {
  const mockRedisClient = {
    isOpen: true,
    ping: vi.fn().mockResolvedValue("PONG"),
    connect: vi.fn().mockResolvedValue(undefined),
    eval: vi.fn(),
    del: vi.fn().mockResolvedValue(1),
    on: vi.fn(),
  };

  return {
    createClient: vi.fn().mockReturnValue(mockRedisClient),
  };
});

describe("parseTimeWindow", () => {
  it("should parse time windows correctly", () => {
    expect(parseTimeWindow("100 ms")).toBe(100);
    expect(parseTimeWindow("5 s")).toBe(5000);
    expect(parseTimeWindow("2 m")).toBe(120000);
    expect(parseTimeWindow("1 h")).toBe(3600000);
    expect(parseTimeWindow("1 d")).toBe(86400000);
  });

  it("should throw error for invalid time values", () => {
    expect(() => parseTimeWindow("0 s")).toThrow(RatelimitError);
    expect(() => parseTimeWindow("-5 s")).toThrow(RatelimitError);
    expect(() => parseTimeWindow("invalid s" as TimeWindow)).toThrow(
      RatelimitError
    );
  });

  it("should throw error for invalid time units", () => {
    const INVALID = "10 invalid" as TimeWindow;
    expect(() => parseTimeWindow(INVALID)).toThrow(RatelimitError);
  });
});

describe("Limiter configuration functions", () => {
  it("should create fixed window options", () => {
    const options = fixedWindow(100, "30 s");
    expect(options).toEqual({
      limit: 100,
      interval: 30000,
    });
  });

  it("should create sliding window options", () => {
    const options = slidingWindow(50, "1 m");
    expect(options).toEqual({
      limit: 50,
      interval: 60000,
    });
  });

  it("should create token bucket options", () => {
    const options = tokenBucket(10, "1 s", 100);
    expect(options).toEqual({
      refillRate: 10,
      interval: 1000,
      limit: 100,
    });
  });
});

describe("Ratelimit", () => {
  // biome-ignore lint/suspicious/noExplicitAny: Better Type Support Needed
  let redis: any;
  let ratelimit: Ratelimit;

  beforeEach(() => {
    redis = createClient();
    ratelimit = new Ratelimit({
      redis,
      limiter: slidingWindow(10, "10 s"),
      prefix: "test",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("sliding window limiter", () => {
    it("should allow requests under the limit", async () => {
      redis.eval.mockResolvedValueOnce([1, 10, 9, 1649000000000, 0]);

      const result = await ratelimit.limit("user1");

      expect(result).toEqual({
        success: true,
        limit: 10,
        remaining: 9,
        reset: 1649000000000,
      });
    });

    it("should block requests over the limit", async () => {
      redis.eval.mockResolvedValueOnce([0, 10, 0, 1649000000000, 5]);

      const result = await ratelimit.limit("user1");

      expect(result).toEqual({
        success: false,
        limit: 10,
        remaining: 0,
        reset: 1649000000000,
        retryAfter: 5,
      });
    });

    it("should include analytics when enabled", async () => {
      redis.eval.mockResolvedValueOnce([1, 10, 9, 1649000000000, 0, 1, 5]);

      const analyticsRatelimit = new Ratelimit({
        redis,
        limiter: slidingWindow(10, "10 s"),
        prefix: "test",
        analytics: true,
      });

      const result = await analyticsRatelimit.limit("user1");

      expect(result).toEqual({
        success: true,
        limit: 10,
        remaining: 9,
        reset: 1649000000000,
        pending: 1,
        throughput: 5,
      });
    });
  });

  describe("fixed window limiter", () => {
    beforeEach(() => {
      ratelimit = new Ratelimit({
        redis,
        limiter: fixedWindow(10, "10 s"),
        prefix: "test",
      });
    });

    it("should allow requests under the limit", async () => {
      redis.eval.mockResolvedValueOnce([1, 10, 9, 1649000000000, 0]);

      const result = await ratelimit.limit("user1");

      expect(result).toEqual({
        success: true,
        limit: 10,
        remaining: 9,
        reset: 1649000000000,
      });
    });
  });

  describe("token bucket limiter", () => {
    beforeEach(() => {
      ratelimit = new Ratelimit({
        redis,
        limiter: tokenBucket(1, "1 s", 10),
        prefix: "test",
      });
    });

    it("should allow requests when tokens are available", async () => {
      redis.eval.mockResolvedValueOnce([1, 10, 9, 1649000000000, 0]);

      const result = await ratelimit.limit("user1");

      expect(result).toEqual({
        success: true,
        limit: 10,
        remaining: 9,
        reset: 1649000000000,
      });
    });
  });

  // Fixed test implementation
  describe("block", () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should wait and retry when rate limited", async () => {
      const originalDateNow = Date.now;
      const mockDateNow = vi.fn(() => Number(vi.getMockedSystemTime()));
      Date.now = mockDateNow;

      // First call fails, second succeeds
      redis.eval
        .mockResolvedValueOnce([0, 10, 0, 1649000000000, 1])
        .mockResolvedValueOnce([1, 10, 9, 1649000000000, 0]);

      // Start the block operation
      const blockPromise = ratelimit.block("user1");

      // Process any pending promises (important!)
      await vi.runOnlyPendingTimersAsync();

      // Advance time to trigger the retry logic
      await vi.advanceTimersByTimeAsync(100);

      // Process any new pending promises
      await vi.runAllTimersAsync();

      // The promise should now resolve
      const result = await blockPromise;

      expect(redis.eval).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        success: true,
        limit: 10,
        remaining: 9,
        reset: 1649000000000,
      });

      // Restore original Date.now
      Date.now = originalDateNow;
    });

    it("should throw after max wait time", async () => {
      const originalDateNow = Date.now;
      let currentTime = Number(vi.getMockedSystemTime());

      // Properly type the mock function
      Date.now = vi.fn(() => currentTime) as () => number;

      // Always return rate limited response
      redis.eval.mockImplementation(() =>
        Promise.resolve([0, 10, 0, 1649000000000, 5])
      );

      // Start the block operation with 1000ms max wait
      const promise = ratelimit.block("user1", 1000);

      // Manually advance our mock time
      currentTime += 1100; // Jump 1100ms ahead

      // Process pending timers without advancing time further
      await vi.runOnlyPendingTimersAsync();

      // Now expect rejection
      await expect(promise).rejects.toThrow(RatelimitError);

      // Restore original Date.now
      Date.now = originalDateNow;
    });
  });

  describe("reset", () => {
    it("should delete the rate limit keys", async () => {
      await ratelimit.reset("user1");

      expect(redis.del).toHaveBeenCalledTimes(2);
      expect(redis.del).toHaveBeenNthCalledWith(1, "test:user1");
      expect(redis.del).toHaveBeenNthCalledWith(2, "test:user1:analytics");
    });
  });
});
