import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { redis, KV_KEYS } from '$lib/server/kv/redis';
import { DatasetSchema, SectorSchema, type Dataset, type Sector } from '$lib/server/data/dataset.schema';
import { normalizeDatasetStructure } from '$lib/server/data/normalizer';
import { expandSector, refreshSectorValues } from '$lib/server/ai/client';
import { sanitizeObject } from '$lib/server/security/sanitize';
import {
	countRecords,
	getBaseDataset,
	getSectorById,
	mergeSector,
	pickRichestSector
} from '$lib/server/data/loader';
import { MAX_RECORDS, RECORDS_PER_RUN, SECTOR_ORDER } from '$lib/server/data/constants';
import { timingSafeEqual } from 'crypto';

function normalizeSector(candidate: unknown) {
	const wrapped = normalizeDatasetStructure({ sectors: [candidate] }) as { sectors: unknown[] };
	return SectorSchema.parse(wrapped.sectors[0]);
}

export const GET = async ({ request }) => {
	// Cron jobs from Vercel don't send an Origin header; browsers do.
	// Reject any request that includes one as an extra layer of defense.
	if (request.headers.get('origin')) {
		throw error(403, { message: 'Forbidden' });
	}

	const auth = request.headers.get('authorization') ?? '';
	const expected = `Bearer ${env.CRON_SECRET}`;

	if (auth.length !== expected.length) {
		throw error(401, { message: 'Unauthorized' });
	}

	const authBuf = Buffer.from(auth);
	const expectedBuf = Buffer.from(expected);

	if (!timingSafeEqual(authBuf, expectedBuf)) {
		throw error(401, { message: 'Unauthorized' });
	}

	try {
		const stored = await redis.get<Dataset>(KV_KEYS.dataset);
		const dataset = stored ? DatasetSchema.parse(sanitizeObject(stored)) : getBaseDataset();

		const total = countRecords(dataset);
		const mode = total < MAX_RECORDS ? 'growth' : 'values-only';

		let targetSector: Sector;
		let cursor = 0;

		if (mode === 'growth') {
			targetSector = pickRichestSector(dataset);
		} else {
			cursor = (await redis.get<number>(KV_KEYS.cursor)) ?? 0;
			const sectorId = SECTOR_ORDER[cursor % SECTOR_ORDER.length];
			targetSector = getSectorById(dataset, sectorId) ?? pickRichestSector(dataset);
		}

		const candidate =
			mode === 'growth'
				? await expandSector(targetSector, Math.min(RECORDS_PER_RUN, MAX_RECORDS - total))
				: await refreshSectorValues(targetSector);

		const updatedSector = normalizeSector(sanitizeObject(candidate));
		const merged = mergeSector(dataset, updatedSector);
		merged.meta = { ...merged.meta, records: countRecords(merged) };

		const validated = DatasetSchema.parse(merged);

		await redis.set(KV_KEYS.dataset, validated);
		await redis.set(KV_KEYS.updatedAt, new Date().toISOString());

		if (mode === 'values-only') {
			await redis.set(KV_KEYS.cursor, (cursor + 1) % SECTOR_ORDER.length);
		}

		return json({ ok: true, sector: updatedSector.id, mode, records: validated.meta.records });
	} catch (err) {
		console.error('[cron] Error actualizando dataset:', err);
		throw error(500, { message: 'Error generando dataset con IA' });
	}
};
