import { redis, KV_KEYS } from '../kv/redis';
import { DatasetSchema, SectorSchema, type Dataset, type Sector } from './dataset.schema';
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
      const parsed = DatasetSchema.parse(fromKv);
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
  const existingSector = dataset.sectors.find((s) => s.id === updatedSector.id);

  if (!existingSector) {
    return {
      ...dataset,
      sectors: dataset.sectors.map((sector) => (sector.id === updatedSector.id ? updatedSector : sector))
    };
  }

  const existingCategories = new Map(existingSector.categories.map((c) => [c.id, c]));
  const updatedCategoryIds = new Set(updatedSector.categories.map((c) => c.id));

  // Merge categories from updated sector
  const mergedCategories = updatedSector.categories.map((updatedCat) => {
    const existingCat = existingCategories.get(updatedCat.id);
    if (!existingCat) {
      return updatedCat;
    }

    // Merge jobs: replace existing jobs with updated ones, preserve any omitted by AI
    const updatedJobIds = new Set(updatedCat.jobs.map((j) => j.id));
    const preservedJobs = existingCat.jobs.filter((j) => !updatedJobIds.has(j.id));

    return {
      ...updatedCat,
      jobs: [...updatedCat.jobs, ...preservedJobs]
    };
  });

  // Preserve categories that the AI might have omitted
  const preservedCategories = existingSector.categories.filter((c) => !updatedCategoryIds.has(c.id));

  const finalSector: Sector = {
    ...updatedSector,
    categories: [...mergedCategories, ...preservedCategories]
  };

  return {
    ...dataset,
    sectors: dataset.sectors.map((sector) => (sector.id === updatedSector.id ? finalSector : sector))
  };
}

async function seedDatasetWithAI(): Promise<Dataset> {
  try {
    console.log('[loader] Redis vacío. Guardando dataset base inicial...');
    const base = getBaseDataset();
    const baseRecords = countRecords(base);
    console.log(`[loader] Dataset base tiene ${baseRecords} registros.`);

    // Guardamos el dataset base primero para asegurar que nunca perdemos los registros originales
    try {
      await redis.set(KV_KEYS.dataset, base);
      await redis.set(KV_KEYS.updatedAt, new Date().toISOString());
      console.log(`[loader] Dataset base guardado en Redis con ${baseRecords} registros.`);
    } catch (err) {
      console.error('[loader] Error guardando dataset base en Redis:', err);
    }

    let dataset = base;

    // Refrescamos sector por sector con merge para no perder registros si la IA omite alguno
    for (const sector of base.sectors) {
      try {
        console.log(`[loader] Refrescando sector: ${sector.id} (${countSectorRecords(sector)} jobs)...`);
        const candidate = await refreshSectorValues(sector);
        const normalized = normalizeDatasetStructure({ sectors: [candidate] }) as { sectors: unknown[] };
        const updatedSector = SectorSchema.parse(normalized.sectors[0]);
        dataset = mergeSector(dataset, updatedSector);
        console.log(`[loader] Sector ${sector.id} refrescado. Total dataset: ${countRecords(dataset)} registros.`);
      } catch (err) {
        console.error(`[loader] Error refrescando sector ${sector.id}:`, err);
      }
    }

    dataset.meta = { ...dataset.meta, records: countRecords(dataset) };
    const validated = DatasetSchema.parse(dataset);

    try {
      await redis.set(KV_KEYS.dataset, validated);
      await redis.set(KV_KEYS.updatedAt, new Date().toISOString());
      console.log(`[loader] Dataset refrescado guardado en Redis con ${validated.meta.records} registros.`);
    } catch (err) {
      console.error('[loader] Error guardando dataset refrescado en Redis:', err);
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
