import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { env } from '$env/dynamic/private';
import { SectorSchema, type Sector } from '$lib/server/data/dataset.schema';
import { buildExpandPrompt, buildRefreshPrompt } from './prompts';

const MODEL = 'gemini-3.1-flash-lite';

if (!env.GOOGLE_AI_API_KEY) {
	throw new Error('GOOGLE_AI_API_KEY environment variable is not set');
}

const ai = new GoogleGenAI({ apiKey: env.GOOGLE_AI_API_KEY });

// La API de Gemini solo soporta un subconjunto de JSON Schema en `responseJsonSchema`
// ($id, $defs, $ref, $anchor, type, properties, etc.). La clave "$schema" que genera
// zod no está en esa lista, así que la removemos para evitar que el campo sea ignorado
// o rechazado por la API.
const SECTOR_JSON_SCHEMA = z.toJSONSchema(SectorSchema) as Record<string, unknown>;
delete SECTOR_JSON_SCHEMA.$schema;

/**
 * Procesa la respuesta de la IA. 
 * Al usar Structured Outputs de forma correcta, la respuesta de Gemini ya es un JSON válido de manera garantizada.
 */
function parseDatasetJson(responseText: string | undefined | null): unknown {
	if (!responseText?.trim()) {
		throw new Error('La IA devolvió una respuesta vacía');
	}
	try {
		return JSON.parse(responseText.trim());
	} catch (err) {
		console.error('[ai] Error crítico al parsear el JSON nativo de Gemini:', responseText);
		throw err;
	}
}

function normalizeSourceUrl(source: string) {
	try {
		const url = new URL(source.trim());
		if (url.protocol !== 'https:') return null;
		url.hash = '';
		return url.toString().replace(/\/$/, '');
	} catch {
		return null;
	}
}

function verifyGroundedSources(candidate: Sector, original: Sector, groundedUrls: Set<string>) {
	const originalJobs = new Map(original.categories.flatMap((category) => category.jobs.map((job) => [job.id, job] as const)));

	for (const category of candidate.categories) {
		for (const job of category.jobs) {
			const previous = originalJobs.get(job.id);
			const salaryChanged = !previous || JSON.stringify(previous.salary) !== JSON.stringify(job.salary);
			const freelanceRatesChanged = !previous || JSON.stringify(previous.freelance.rates) !== JSON.stringify(job.freelance.rates);

			if (salaryChanged) {
				const sourceUrl = normalizeSourceUrl(job.source);
				if (!sourceUrl || !groundedUrls.has(sourceUrl)) {
					throw new Error(`Google Search no respaldó el salario del cargo ${job.id}`);
				}
				job.source = sourceUrl;
			} else if (previous) {
				job.source = previous.source;
			}

			if (freelanceRatesChanged) {
				const sourceUrl = normalizeSourceUrl(job.freelance.source_freelance);
				if (!sourceUrl || !groundedUrls.has(sourceUrl)) {
					throw new Error(`Google Search no respaldó la tarifa freelance del cargo ${job.id}`);
				}
				job.freelance.source_freelance = sourceUrl;
			} else if (previous) {
				job.freelance.source_freelance = previous.freelance.source_freelance;
			}
		}
	}

	return candidate;
}

async function generateGroundedSector(prompt: string, original: Sector): Promise<Sector> {
	const response = await ai.models.generateContent({
		model: MODEL,
		contents: prompt,
		config: {
			temperature: 0,
			tools: [{ googleSearch: {} }],
			responseMimeType: 'application/json',
			responseJsonSchema: SECTOR_JSON_SCHEMA
		}
	});

	const groundedUrls = new Set(
		(response.candidates ?? [])
			.flatMap((candidate) => candidate.groundingMetadata?.groundingChunks ?? [])
			.map((chunk) => (chunk.web?.uri ? normalizeSourceUrl(chunk.web.uri) : null))
			.filter((url): url is string => Boolean(url))
	);

	if (!groundedUrls.size) {
		throw new Error('Google Search no devolvió fuentes web verificables');
	}

	const candidate = SectorSchema.parse(parseDatasetJson(response.text));
	return verifyGroundedSources(candidate, original, groundedUrls);
}

export async function expandSector(sector: Sector, recordsToAdd: number): Promise<unknown> {
	return generateGroundedSector(buildExpandPrompt(sector, recordsToAdd), sector);
}

export async function refreshSectorValues(sector: Sector): Promise<unknown> {
	return generateGroundedSector(buildRefreshPrompt(sector), sector);
}
