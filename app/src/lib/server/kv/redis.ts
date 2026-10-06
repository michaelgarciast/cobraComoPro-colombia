import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';

const url = env.UPSTASH_REDIS_REST_URL;
const token = env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  throw new Error('Upstash Redis environment variables are not configured');
}

export const redis = new Redis({
  url,
  token
});
