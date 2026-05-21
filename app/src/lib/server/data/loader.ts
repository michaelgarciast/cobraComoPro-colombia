import { redis, KV_KEYS } from '../kv/redis';
import { DatasetSchema, type Dataset } from './dataset.schema';
import { sanitizeObject } from '../security/sanitize';

let memoryCache: { data: Dataset; ts: number } | null = null;
const TTL_MS = 60 * 60 * 1000;

export async function loadDataset(): Promise<Dataset | null> {
  if (memoryCache && Date.now() - memoryCache.ts < TTL_MS) {
    return memoryCache.data;
  }

  try {
    const fromKv = await redis.get<Dataset>(KV_KEYS.dataset);
    if (fromKv) {
      const sanitized = sanitizeObject(fromKv);
      const parsed = DatasetSchema.parse(sanitized);
      memoryCache = { data: parsed, ts: Date.now() };
      return parsed;
    }
  } catch (error) {
    console.error('[loader] Error leyendo de Redis:', error);
  }

  return null;
}

export async function getUpdatedAt(): Promise<string | null> {
  try {
    return await redis.get<string>(KV_KEYS.updatedAt);
  } catch (error) {
    console.error('[loader] Error leyendo updatedAt:', error);
    return null;
  }
}
