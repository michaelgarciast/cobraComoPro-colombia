import { redis, KV_KEYS } from '../kv/redis';
import { DatasetSchema, SectorSchema, type Dataset, type Sector } from './dataset.schema';
import { sanitizeObject } from '../security/sanitize';
import { refreshSectorValues } from '$lib/server/ai/client';
import { normalizeDatasetStructure } from './normalizer';
import baseDataset from './db_data_colombia.json';
import { SECTOR_ORDER } from './constants';

let memoryCache: { data: Dataset; ts: number } | null = null;
const TTL_MS = 60 * 60 * 1000;

export async function loadDataset(): Promise<Dataset> {
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

  return seedDatasetWithAI();
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

async function seedDatasetWithAI(): Promise<Dataset> {
  try {
    console.log('[loader] Redis vacío. Consultando IA para dataset inicial...');
    const dataset = getBaseDataset();

    const refreshedSectors = await Promise.all(
      dataset.sectors.map(async (sector) => {
        try {
          const candidate = await refreshSectorValues(sector);
          const normalized = normalizeDatasetStructure({ sectors: [candidate] }) as { sectors: unknown[] };
          return SectorSchema.parse(normalized.sectors[0]);
        } catch (err) {
          console.error(`[loader] Error refrescando sector ${sector.id}:`, err);
          return sector;
        }
      })
    );

    const updatedDataset: Dataset = {
      ...dataset,
      sectors: refreshedSectors,
      meta: { ...dataset.meta, records: countRecords({ ...dataset, sectors: refreshedSectors }) }
    };

    const validated = DatasetSchema.parse(updatedDataset);

    try {
      await redis.set(KV_KEYS.dataset, validated);
      await redis.set(KV_KEYS.updatedAt, new Date().toISOString());
      console.log('[loader] Dataset inicial guardado en Redis.');
    } catch (err) {
      console.error('[loader] Error guardando dataset en Redis:', err);
    }

    memoryCache = { data: validated, ts: Date.now() };
    return validated;
  } catch (err) {
    console.error('[loader] Error en seedDatasetWithAI:', err);
    const fallback = getBaseDataset();
    memoryCache = { data: fallback, ts: Date.now() };
    return fallback;
  }
}
