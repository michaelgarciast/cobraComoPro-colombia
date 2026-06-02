import { redis, KV_KEYS } from '../kv/redis';
import { DatasetSchema, type Dataset, type Sector } from './dataset.schema';
import { sanitizeObject } from '../security/sanitize';
import baseDataset from './db_data_colombia.json';
import { SECTOR_ORDER } from './constants';

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

export function getBaseDataset(): Dataset {
  return DatasetSchema.parse(structuredClone(baseDataset));
}

export function countSectorRecords(sector: Sector): number {
  return sector.categories.reduce((acc, category) => acc + category.jobs.length, 0);
}

export function countRecords(dataset: Dataset): number {
  return dataset.sectors.reduce((acc, sector) => acc + countSectorRecords(sector), 0);
}

export function pickRichestSector(dataset: Dataset): Sector {
  const orderIndex = (id: string) => {
    const idx = SECTOR_ORDER.indexOf(id as (typeof SECTOR_ORDER)[number]);
    return idx === -1 ? SECTOR_ORDER.length : idx;
  };

  return dataset.sectors.reduce((best, sector) => {
    const bestCount = countSectorRecords(best);
    const sectorCount = countSectorRecords(sector);
    if (sectorCount > bestCount) return sector;
    if (sectorCount === bestCount && orderIndex(sector.id) < orderIndex(best.id)) return sector;
    return best;
  });
}

export function getSectorById(dataset: Dataset, id: string): Sector | undefined {
  return dataset.sectors.find((sector) => sector.id === id);
}

export function mergeSector(dataset: Dataset, updatedSector: Sector): Dataset {
  return {
    ...dataset,
    sectors: dataset.sectors.map((sector) => (sector.id === updatedSector.id ? updatedSector : sector))
  };
}
