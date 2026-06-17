import { GoogleGenAI } from '@google/genai';
import { jsonrepair } from 'jsonrepair';
import { z } from 'zod';
import { env } from '$env/dynamic/private';
import { SectorSchema, type Sector } from '$lib/server/data/dataset.schema';
import { buildExpandPrompt, buildRefreshPrompt } from './prompts';

const MODEL = 'gemini-2.5-flash';

if (!env.GOOGLE_AI_API_KEY) {
	throw new Error('GOOGLE_AI_API_KEY environment variable is not set');
}

const ai = new GoogleGenAI({ apiKey: env.GOOGLE_AI_API_KEY });

function extractJsonPayload(raw: string | undefined | null): string {
	if (!raw?.trim()) {
		throw new Error('AI no devolvió contenido para el dataset');
	}

	const trimmed = raw.trim();
	const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
	if (fencedMatch) {
		return fencedMatch[1].trim();
	}

	const firstBrace = trimmed.indexOf('{');
	const lastBrace = trimmed.lastIndexOf('}');

	if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
		throw new Error('No se encontró un objeto JSON válido dentro de la respuesta de la IA');
	}

	return trimmed.slice(firstBrace, lastBrace + 1);
}

function parseDatasetJson(raw: string | undefined | null) {
	const payload = extractJsonPayload(raw);

	try {
		return JSON.parse(payload);
	} catch (err) {
		const parseErr = err instanceof Error ? err.message : String(err);
		try {
			const repaired = jsonrepair(payload);
			console.warn('[ai] JSON reparado automáticamente tras error de parseo:', parseErr);
			return JSON.parse(repaired);
		} catch (repairErr) {
			console.error('[ai] JSON inválido generado por Gemini, primeros 500 caracteres:', payload.slice(0, 500));
			console.error('[ai] Reparación automática fallida:', repairErr);
			throw err;
		}
	}
}

export async function expandSector(sector: Sector, recordsToAdd: number): Promise<unknown> {
	const response = await ai.models.generateContent({
		model: MODEL,
		contents: buildExpandPrompt(sector, recordsToAdd),
		config: {
			responseMimeType: 'application/json',
			responseSchema: z.toJSONSchema(SectorSchema)
		}
	});

	return parseDatasetJson(response.text);
}

export async function refreshSectorValues(sector: Sector): Promise<unknown> {
	const response = await ai.models.generateContent({
		model: MODEL,
		contents: buildRefreshPrompt(sector),
		config: {
			responseMimeType: 'application/json',
			responseSchema: z.toJSONSchema(SectorSchema)
		}
	});

	return parseDatasetJson(response.text);
}
