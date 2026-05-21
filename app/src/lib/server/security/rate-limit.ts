import { redis } from '../kv/redis';

interface RateLimitConfig {
	requests: number;
	windowSeconds: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
	requests: 60,
	windowSeconds: 60
};

export async function checkRateLimit(
	identifier: string,
	config: RateLimitConfig = DEFAULT_CONFIG
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
	const key = `ratelimit:${identifier}`;
	const now = Math.floor(Date.now() / 1000);
	const windowStart = now - (now % config.windowSeconds);
	const windowKey = `${key}:${windowStart}`;

	const current = await redis.incr(windowKey);

	if (current === 1) {
		await redis.expire(windowKey, config.windowSeconds);
	}

	const allowed = current <= config.requests;
	const remaining = Math.max(0, config.requests - current);
	const resetAt = windowStart + config.windowSeconds;

	return { allowed, remaining, resetAt };
}
