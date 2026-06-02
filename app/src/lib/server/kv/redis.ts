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

export const KV_KEYS = {
  dataset: 'cobracomopro:dataset:v1',
  updatedAt: 'cobracomopro:dataset:v1:updatedAt',
  cursor: 'cobracomopro:cron:cursor:v1'
} as const;
