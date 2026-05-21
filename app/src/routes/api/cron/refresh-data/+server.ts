import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { redis, KV_KEYS } from '$lib/server/kv/redis';
import { DatasetSchema } from '$lib/server/data/dataset.schema';
import { extractDataset } from '$lib/server/ai/client';
import { sanitizeObject } from '$lib/server/security/sanitize';
import { timingSafeEqual } from 'crypto';

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
		const candidate = await extractDataset();
		const sanitized = sanitizeObject(candidate);
		const validated = DatasetSchema.parse(sanitized);

		await redis.set(KV_KEYS.dataset, validated);
		await redis.set(KV_KEYS.updatedAt, new Date().toISOString());

		return json({ ok: true, records: validated.meta.records });
	} catch (err) {
		console.error('[cron] Error actualizando dataset:', err);
		throw error(500, { message: 'Error generando dataset con IA' });
	}
};
